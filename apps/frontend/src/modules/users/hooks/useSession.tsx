import { User, useViewerLazyQuery } from "@/generated/graphql";
import { isOver24Hours, omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { createSelectors } from "@/utils/selectors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Session, useSessionStore } from "../states/session";
import { useUserStore } from "../states/user";

export default function useSession(orgSlug?: string, projectSlug?: string) {
    const [isValidating, setIsValidating] = useState(true);
    const sessionStore = createSelectors(useSessionStore);
    const userStore = createSelectors(useUserStore);
    const session = sessionStore.use.session();
    const clearSession = sessionStore.use.clearSession();
    const updateSession = sessionStore.use.updateSession();
    const user = userStore.use.user();
    const lastUserUpdate = userStore.use.lastUpdate();
    const updateUser = userStore.use.updateUser();
    const [fetchUser] = useViewerLazyQuery();

    const createSession = useCallback(
        (data?: Session) => {
            if (!data) {
                updateSession({
                    organization: user?.organization,
                    project: user?.project,
                } as Session);
            } else {
                updateSession(data);
            }
        },
        [user],
    );

    const isCurrentOrg = useMemo(() => {
        if (!orgSlug) return false;
        return session?.organization.slug === orgSlug;
    }, [session?.organization.slug, orgSlug]);

    const isValidProject = useMemo(() => {
        if (!projectSlug) {
            return (
                session?.project.organization.id === session?.organization.id
            );
        } else {
            return (
                session?.project.slug === projectSlug &&
                session.project.organization.id === session.organization.id
            );
        }
    }, [projectSlug, orgSlug, session]);

    const isValidSession = useMemo(() => {
        if (!projectSlug && !orgSlug) return true;
        return isCurrentOrg && isValidProject;
    }, [projectSlug, orgSlug]);

    const createValidSessionData = useCallback(() => {
        let org =
            user?.organizations?.edges.find(
                (edge) => edge.node.slug === orgSlug,
            )?.node || null;
        let project = !projectSlug
            ? org?.projects?.edges[0].node
            : org?.projects?.edges.find(
                  (edge) => edge.node.slug === projectSlug,
              )?.node || null;

        if ((!org || !project) && isOver24Hours(lastUserUpdate)) {
            logDebug("User might be stale\nUpdating user...");
            fetchUser({
                onCompleted: ({ viewer }) => {
                    const newUser = omitTypename(viewer as User);
                    updateUser(newUser);
                    org =
                        user?.organizations?.edges.find(
                            (edge) => edge.node.slug === orgSlug,
                        )?.node || null;
                    project = !projectSlug
                        ? org?.projects?.edges[0].node
                        : org?.projects?.edges.find(
                              (edge) => edge.node.slug === projectSlug,
                          )?.node || null;
                },
            });
        }

        if (!org || !project) {
            logDebug("Couldn't find valid org or project\n404 Error.");
            return null;
        }

        return {
            organization: org,
            project: project,
        } as Session;
    }, [orgSlug, projectSlug, session, isCurrentOrg]);

    useEffect(() => {
        if (!orgSlug) {
            logDebug("No orgSlug, No validation required.");
            setIsValidating(false);
            return;
        }

        setIsValidating(true);

        if (isCurrentOrg && isValidProject) {
            logDebug("Session is valid.");
            setIsValidating(false);
            return;
        } else {
            const newSession = createValidSessionData();
            if (newSession) {
                createSession(newSession);
            }
            setIsValidating(false);
        }
    }, [
        orgSlug,
        projectSlug,
        isCurrentOrg,
        isValidProject,
        createValidSessionData,
    ]);

    return {
        user,
        session,
        isValidating,
        isValidSession,
        createSession,
        updateSession,
        clearSession,
        updateUser,
    };
}
