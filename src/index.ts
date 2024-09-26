import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import config from "../config.json";
import { initialize } from "./server";

import { router as studentsRouter } from "./routes/students";
import { router as professorsRouter } from "./routes/professors";
import { router as coursesRouter } from "./routes/courses";
import { router as enrollmentRoute } from './routes/enrollments';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(config.swagger)),
);
app.use("/students", studentsRouter);
app.use("/professors", professorsRouter);
app.use("/courses", coursesRouter);
app.use("/enrollments", enrollmentRoute);

app.listen(config.server.port, initialize);
