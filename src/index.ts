import express, { Express } from "express";

import { router as studentsRouter} from './routes/students';

const app: Express = express();
const port = 3000;

app.use("/students", studentsRouter);

app.listen(port, function(){
  console.log(`[server]: Server is running at http://localhost:${port}`);
});