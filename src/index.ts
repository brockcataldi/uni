import express, { Express } from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

import { router as studentsRouter} from './routes/students';

const app: Express = express();
const port = 3000;

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "University Enrollment System",
      version: "0.0.0",
      description:
        "Job Interview Assignment",
    },
  },
  apis: ["**/*.ts"],
};

const specs = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use("/students", studentsRouter);


app.listen(port, function(){
  console.log(`[server]: Server is running at http://localhost:${port}`);
});