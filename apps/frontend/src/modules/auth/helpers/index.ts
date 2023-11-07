import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "../../../routes";

export const handleLoginRedirect = (
  organization,
  project,
  navigate: NavigateFunction,
) => {
  console.log(organization, project);
  if (!organization) {
    navigate(ROUTES.CREATE_WORKSPACE);
  } else if (organization && project && project.hasCompletedOnboardingFor) {
    navigate(`${organization.slug}/projects/${project.id}`);
  } else if (organization && project && !project.hasCompletedOnboardingFor) {
    navigate(`${organization.slug}/get-started`);
  }
};
