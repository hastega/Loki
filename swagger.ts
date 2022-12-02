const swaggerAutogen = require('swagger-autogen');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        info: {
            title: ' Hastega mock API',
            version: '1.0.0',
            description: 'A simple express library API with local db',
        },
        servers: [
            {
                url: 'http://localhost:4201',
            },
        ],
    },
    apis: ['./src/routes/v1/localCache.routes.ts'],
};

const specs = swaggerJSDoc(options);

const outputFile = './src/swagger-output.json';
const endpointFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointFiles, specs);
