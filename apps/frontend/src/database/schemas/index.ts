import { projectSchema } from "./project.schema";
import { viewerSchema } from "./viewer.schema";

export const schema = {
    viewer: {
        schema: viewerSchema,
    },
    projects: {
        schema: projectSchema,
    },
};
