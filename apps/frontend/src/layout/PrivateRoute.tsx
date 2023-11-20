import { GlobalSpinner, NotFound } from "@/components";
import { createOrgDbs } from "@/database";
import {
    OrganizationCountableEdge,
    useViewerLazyQuery,
} from "@/generated/graphql";
import { handleRedirect } from "@/modules/auth/helper";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { useSession } from "@/modules/users/hooks/useSession";
import { SessionViewer } from "@/types";
import { omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};
export const PrivateRoute = ({ children }: Props) => {
    const [ready, setReady] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    const { token } = useAuthToken();
    const { organizationSlug, projectId } = useParams();
    const { viewer, createSession, updateSession } = useSession();
    const navigate = useNavigate();
    const [fetchViewer, { loading }] = useViewerLazyQuery();

    useEffect(() => {
        let user: SessionViewer | null = viewer || null;
        let viewerIsLatest = false;
        let shouldRedirect = false;
        let org: OrganizationCountableEdge | null = null;

        const validateUrl = async () => {
            if (!token) {
                return;
            }
            logDebug("viewer: ", user);
            if (!user) {
                logDebug(
                    "No viewer, checking local storage...",
                    "PrivateRoute",
                );
                const getCachedViewer = localStorage.getItem("viewer");
                if (getCachedViewer) {
                    user = JSON.parse(getCachedViewer) as SessionViewer;
                    createSession(user);
                } else {
                    logDebug("No viewer in local storage, fetching viewer...");
                    await fetchViewer({
                        onCompleted: ({ viewer }) => {
                            logDebug("Gotten viewer, updating session...");
                            user = omitTypename(viewer);
                            createSession(user);
                            viewerIsLatest = true;
                        },
                    });
                }
            }

            if (!user) {
                logDebug("No user, redirecting to login...");
                navigate("/");
                return;
            }

            logDebug("Viewer check passed, checking org...");

            // Org checks
            if (organizationSlug !== user.organization?.slug) {
                logDebug(
                    "Requested organization is not the current organization,\nChecking if user belongs to this organization",
                );
                org =
                    user.organizations?.edges.find((edge) => {
                        return edge.node.slug === organizationSlug;
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
                                    return edge.node.slug === organizationSlug;
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

            logDebug(
                !projectId &&
                    user.project?.organization.slug === organizationSlug,
            );

            // Project checks
            if (
                !projectId &&
                user.project?.organization.slug === organizationSlug
            ) {
                logDebug(
                    "No projectId supplied and current project belongs to current org\nRedirecting to current project...",
                );
                shouldRedirect = true;
            }

            if (
                !projectId &&
                user.project?.organization.slug !== organizationSlug
            ) {
                logDebug(
                    "No projectId supplied and current project does not belong to current org\nUpdating current project...",
                );

                user!.project = org?.node.projects?.edges[0].node;
                updateSession(user);
                shouldRedirect = true;
            }

            if (
                (projectId &&
                    user.project?.id === projectId &&
                    user.project.organization.slug !== organizationSlug) ||
                (projectId && user.project?.id !== projectId)
            ) {
                logDebug("Project mismatch, updating current project...");
                const proj = org?.node.projects?.edges.find(
                    (edge) => edge.node.id === projectId,
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
                                (edge) => edge.node.id === projectId,
                            );

                            if (
                                !proj ||
                                (proj &&
                                    proj.node.organization.slug !==
                                        organizationSlug)
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

        validateUrl();
    }, []);

    useEffect(() => {
        if (viewer) {
            localStorage.setItem("viewer", JSON.stringify(viewer));
            createOrgDbs(viewer);
        }
    }, [viewer]);

    if (!token) {
        return <Navigate to="/" />;
    }

    if (!ready || loading) {
        return <GlobalSpinner />;
    }

    if (invalidUrl) {
        return <NotFound />;
    }

    return <>{children}</>;
};
