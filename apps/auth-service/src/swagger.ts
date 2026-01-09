import 'dotenv/config';
import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Auth Service API',
    description: 'API documentation for the Auth Service',
  },
  host: `localhost:${process.env.AUTH_PORT}`,
  schemes: ['http'],
};

const outputFile = path.join(__dirname, 'assets', 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, 'routes', 'auth.router.ts')];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});
