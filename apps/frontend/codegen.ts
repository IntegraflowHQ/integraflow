import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    // schema: '../../backend/integraflow/graphql/schema.graphql', // process.env.REACT_APP_SERVER_BASE_URL + '/graphql',
    schema: 'https://d687-102-219-54-33.ngrok-free.app/graphql', // process.env.REACT_APP_SERVER_BASE_URL + '/graphql',
    documents: ['./src/modules/**/*.tsx', './src/modules/**/*.ts'],
    overwrite: true,
    generates: {
        './src/generated/graphql.tsx': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                skipTypename: false,
                withHooks: true,
                withHOC: false,
                withComponent: false,
                scalars: {
                    DateTime: 'string',
                },
            },
        },
    },
};

export default config;
