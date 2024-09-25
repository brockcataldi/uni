/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - student_id
 *         - name
 *         - email
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
 *     Students:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Student'
 *       example:
 *         - id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 *     StudentRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the Student
 *         email:
 *           type: string
 *           description: The Student's email
 *       example:
 *         name: Example Exampleton
 *         email: example@example.com
 */
/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The Students API 
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
*     responses:
 *       200:
 *         description: The created Student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Creates new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRequest'
 *     responses:
 *       200:
 *         description: The created Student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       500:
 *         description: Some server error
 *
 */
import { Router, Request, Response } from "express";
import { query } from "../database";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const [result, ] = await query('SELECT * FROM students');
    res.json(result);
})

router.post('/', async (req: Request, res: Response) => {
    // const [result, ] = await query('SELECT * FROM students');
    res.json({ 'hello': req.body.name });
})

export { router };