// EXTERNAL MODULES
import expressJSDocSwagger from 'express-jsdoc-swagger';
import path from 'node:path';

const options = {
  info: {
    version: '1.0.0',
    title: 'CityZen',
    description: 'Une API permettant de chercher des activités d\'une ville',
    license: {
      name: 'MIT',
    },
  },
  // security: {
  //   BasicAuth: {
  //     type: 'http',
  //     scheme: 'basic',
  //   },
  // },
  // Base directory which we use to locate your JSDOC files
  baseDir: path.join(import.meta.dirname, '/app'),
  // baseDir: import.meta.dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: '../../**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  // apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  // multiple: true,

};
// console.log(import.meta.dirname);

export default (app) => expressJSDocSwagger(app)(options);