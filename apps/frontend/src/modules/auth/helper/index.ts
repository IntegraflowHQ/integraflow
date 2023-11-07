import { AuthOrganization, Project } from "@/generated/graphql";
import { NavigateFunction } from "react-router-dom";

export const handleLoginRedirect = (
  organization: AuthOrganization,
  project: Project,
  navigate: NavigateFunction,
) => {
  console.log(organization, project);
  if (!organization) {
    navigate("/create-workspace");
  } else if (organization && project && project.hasCompletedOnboardingFor) {
    navigate(`${organization.slug}/projects/${project.id}`);
  } else if (organization && project && !project.hasCompletedOnboardingFor) {
    navigate(`${organization.slug}/get-started`);
  }
};
