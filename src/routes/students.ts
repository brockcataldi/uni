/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         student_id:
 *           type: string
 *           description: The auto-generated id of the student
 *         name:
 *           type: string
 *           description: The name of the Student
 *         email:
 *           type: string
 *           description: The Student's email
 *       example:
 *         id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 */
import { Router, Request, Response } from "express";
import { query } from "../database";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const [result, ] = await query('SELECT * FROM students');
    res.json(result);
})

export { router };