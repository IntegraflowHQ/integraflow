import {
    OrganizationCountableEdge,
    useViewerLazyQuery,
} from "@/generated/graphql";
import { handleRedirect } from "@/modules/auth/helper";
import { useSession } from "@/modules/users/hooks/useSession";
import useUser from "@/modules/users/hooks/useUser";
import { SessionViewer } from "@/types";
import { omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useValidateOrgUrl(
    orgSlug?: string,
    projectSlug?: string,
) {
    const [ready, setReady] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    const navigate = useNavigate();
    const { updateSession } = useSession();
    const [fetchViewer, { loading }] = useViewerLazyQuery();
    const { user: viewer, isLatest } = useUser();

    useEffect(() => {
        const validateOrg = async () => {
            let user: SessionViewer | null = viewer;
            let viewerIsLatest = isLatest;
            let shouldRedirect = false;
            let org: OrganizationCountableEdge | null = null;

            logDebug("viewer: ", user);

            if (!user) {
                logDebug("No user, redirecting to login...");
                navigate("/");
                return;
            }

            logDebug("Viewer check passed, checking org...");

            // Org checks
            if (orgSlug !== user.organization?.slug) {
                logDebug(
                    "Requested organization is not the current organization,\nChecking if user belongs to this organization",
                );
                org =
                    user.organizations?.edges.find((edge) => {
                        return edge.node.slug === orgSlug;
                    }) ?? null;

                if (org) {
                    user.organization = {
                        id: org.node.id,
                        memberCount: org.node.memberCount,
                        name: org.node.name,
                        slug: org.node.slug,
                    };
                    updateSession(user);
                }

                if (!org && viewerIsLatest) {
                    logDebug("Org does not exist. 404 error, exiting...");
                    setInvalidUrl(true);
                    setReady(true);
                    return;
                }

                if (!org && !viewerIsLatest) {
                    logDebug(
                        "Couldn't find org, updating orgs and retrying...",
                    );
                    await fetchViewer({
                        onCompleted: ({ viewer }) => {
                            user = omitTypename(viewer);
                            updateSession(user);
                            viewerIsLatest = true;
                            logDebug("Updated orgs, retrying...");
                            org =
                                user.organizations?.edges.find((edge) => {
                                    return edge.node.slug === orgSlug;
                                }) ?? null;

                            if (!org) {
                                logDebug("Org does not exist. 404 error.");
                                setInvalidUrl(true);
                                setReady(true);
                                return;
                            }

                            user.organization = {
                                id: org.node.id,
                                memberCount: org.node.memberCount,
                                name: org.node.name,
                                slug: org.node.slug,
                            };
                            updateSession(user);
                        },
                    });
                }
            }

            logDebug("Org check passed, checking project...");

            // Project checks
            if (!projectSlug && user.project?.organization.slug === orgSlug) {
                logDebug(
                    "No projectSlug supplied and current project belongs to current org\nRedirecting to current project...",
                );
                shouldRedirect = true;
            }

            if (!projectSlug && user.project?.organization.slug !== orgSlug) {
                logDebug(
                    "No projectSlug supplied and current project does not belong to current org\nUpdating current project...",
                );

                user!.project = org?.node.projects?.edges[0].node;
                updateSession(user);
                shouldRedirect = true;
            }

            if (
                (projectSlug &&
                    user.project?.slug === projectSlug &&
                    user.project.organization.slug !== orgSlug) ||
                (projectSlug && user.project?.slug !== projectSlug)
            ) {
                logDebug("Project mismatch, updating current project...");
                const proj = org?.node.projects?.edges.find(
                    (edge) => edge.node.id === projectSlug,
                );

                if (!proj && viewerIsLatest) {
                    logDebug("Project does not exist. 404 error.");
                    setInvalidUrl(true);
                    setReady(true);
                    return;
                }

                if (!proj && !viewerIsLatest) {
                    logDebug(
                        "Couldn't find project, updating projects and retrying...",
                    );
                    await fetchViewer({
                        onCompleted: ({ viewer }) => {
                            user!.projects = omitTypename(viewer?.projects);
                            user!.organizations = omitTypename(
                                viewer?.organizations,
                            );
                            updateSession(user);
                            viewerIsLatest = true;
                            logDebug("Updated projects, retrying...");
                            const proj = user.projects?.edges.find(
                                (edge) => edge.node.id === projectSlug,
                            );

                            if (
                                !proj ||
                                (proj &&
                                    proj.node.organization.slug !== orgSlug)
                            ) {
                                logDebug("Project does not exist. 404 error.");
                                setInvalidUrl(true);
                                setReady(true);
                                return;
                            }

                            user!.project = proj.node;
                            updateSession(user!);
                        },
                    });
                }
            }
            setReady(true);
            if (shouldRedirect) {
                handleRedirect(user, navigate);
            }
        };

        if (orgSlug) {
            validateOrg();
        } else if (!orgSlug && !ready) {
            setReady(true);
        }
    }, [orgSlug, projectSlug]);

    return { ready, invalidUrl, loading, setReady };
}
