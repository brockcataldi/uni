import express, { Express, Request, Response} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

import { router as studentsRouter} from './routes/students';

import config from '../config.json';

const app: Express = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

app.post('/setup', async (req: Request, res: Response) => {
    res.json({hello: 'world'});
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(config.swagger)))
app.use('/students', studentsRouter);

app.listen(config.server.port, function(){
  console.log(`[server]: Server is running at http://localhost:${config.server.port}`);
});