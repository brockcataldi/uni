import { Router, Request, Response } from "express";
import { query } from "../database";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const [result, ] = await query('SELECT * FROM students');
    res.json(result);
})

export { router };