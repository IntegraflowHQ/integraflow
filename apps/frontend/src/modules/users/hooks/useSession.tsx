import {
    Project,
    ProjectCountableEdge,
    User,
    useViewerLazyQuery,
} from "@/generated/graphql";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import { isOver24Hours, omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { DeepOmit } from "@apollo/client/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Session } from "../states/session";
import useSessionState from "./useSessionState";
import useUserState from "./useUserState";

export default function useSession() {
    const [isValidating, setIsValidating] = useState(true);
    const { orgSlug, projectSlug } = useParams();
    const { session, updateSession, clearSession } = useSessionState();
    const { user, lastUpdate: lastUserUpdate, updateUser } = useUserState();
    const [fetchUser] = useViewerLazyQuery();
    const redirect = useRedirect();

    const createSession = useCallback(
        (data: Session) => {
            updateSession(data);
            if (
                orgSlug !== data.organization.slug ||
                projectSlug !== data.project.slug
            ) {
                redirect(data);
            }
        },
        [orgSlug, projectSlug],
    );

    const isCurrentOrg = useMemo(() => {
        if (!orgSlug) return false;
        return session?.organization.slug === orgSlug;
    }, [session?.organization.slug, orgSlug]);

    const isValidProject = useMemo(() => {
        if (!projectSlug) {
            return (
                session?.project.organization.slug ===
                session?.organization.slug
            );
        } else {
            return (
                session?.project.slug === projectSlug &&
                session.project.organization.slug === session.organization.slug
            );
        }
    }, [projectSlug, orgSlug, session]);

    const isValidSession = useMemo(() => {
        if (!projectSlug && !orgSlug) return true;
        return isCurrentOrg && isValidProject;
    }, [projectSlug, orgSlug, isCurrentOrg, isValidProject]);

    const createValidSessionData = useCallback(async () => {
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
            await fetchUser({
                onCompleted: ({ viewer }) => {
                    const newUser = omitTypename(viewer as User);
                    updateUser(newUser);
                    org =
                        newUser?.organizations?.edges.find(
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
    }, [orgSlug, projectSlug, session]);

    const currentOrgData = useMemo(() => {
        const data =
            user?.organizations?.edges.find(
                (edge) => edge.node.slug === session?.organization.slug,
            )?.node || null;

        return data;
    }, [user?.organizations, session?.organization.id]);

    const projects = useMemo(() => {
        return (
            currentOrgData?.projects?.edges || ([] as ProjectCountableEdge[])
        );
    }, [currentOrgData]);

    useEffect(() => {
        if (!orgSlug) {
            logDebug("No orgSlug, No validation required.");
            setIsValidating(false);
            return;
        }

        setIsValidating(true);

        if (isCurrentOrg && isValidProject) {
            logDebug("Session is valid.");
            if (!projectSlug) {
                redirect(session as Session);
            }
            setIsValidating(false);
            return;
        } else {
            logDebug("isCurrentOrg: ", isCurrentOrg);
            logDebug("isValidProject: ", isValidProject);
            logDebug("Creating valid session.");
            createValidSessionData()
                .then((newSession) => {
                    logDebug("New session: ", newSession);
                    if (newSession) {
                        createSession(newSession);
                    }
                    setIsValidating(false);
                })
                .catch(() => {
                    logDebug("Failed to fetch");
                    setIsValidating(false);
                });
        }

        return () => {
            setIsValidating(true);
        };
    }, [
        orgSlug,
        projectSlug,
        isCurrentOrg,
        isValidProject,
        createValidSessionData,
    ]);

    const switchProject = useCallback(
        (project: DeepOmit<Project, "__typename">) => {
            const newSession: Session = {
                organization: session?.organization!,
                project: project,
            };
            createSession(newSession);
        },
        [session, createSession],
    );

    return {
        user,
        session,
        projects,
        isValidating,
        isValidSession,
        createSession,
        clearSession,
        updateUser,
        switchProject,
    };
}
