export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: ' Hastega mock API',
            version: '1.0.0',
            description: 'A simple express library API with local db',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/v1/*.ts'],
};
