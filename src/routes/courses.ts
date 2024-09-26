/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - course_id
 *         - course_name
 *         - professor_id
 *       properties:
 *         course_id:
 *           type: string
 *           description: The auto-generated id of the course
 *         name:
 *           type: string
 *           description: The name of the Course
 *         professor_id:
 *           type: int
 *           description: The Professor's ID
 *       example:
 *         course_id: 1
 *         name: Example's Class on Racoons
 *         professor_id: 1
 *     CourseFull:
 *       type: object
 *       required:
 *         - course_id
 *         - course_name
 *         - professor_id
 *         - name
 *         - email
 *       properties:
 *         course_id:
 *           type: string
 *           description: The auto-generated id of the course
 *         name:
 *           type: string
 *           description: The name of the Course
 *         professor_id:
 *           type: int
 *           description: The Professor's ID
 *       example:
 *         course_id: 1
 *         name: Example's Class on Racoons
 *         professor_id: 1
 *     Courses:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Course'
 *       example:
 *         - course_id: 1
 *           course_name: Example's Class on Racoons
 *           professor_id: 1
 *     CoursesFull:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CourseFull'
 *       example:
 *         - course_id: 1
 *           course_name: Example's Class on Racoons
 *           professor_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 *     CourseRequest:
 *       type: object
 *       required:
 *         - name
 *         - professor_id
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the Course
 *         professor_id:
 *           type: int
 *           description: The Professor's ID
 *       example:
 *         name: Example's Class on Racoons
 *         professor_id: 1
 */
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The Courses Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { query } from "../database";
import {
  INSERT_COURSE,
  SELECT_ALL_COURSES,
  SELECT_ALL_COURSES_BY_PROF,
} from "../queries";

/**
 * Returns all course, filterable by professor
 * 
 * @param req {Request}
 * @param res {Response}
 * @returns
 *
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Returns all professors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoursesFull'
 *       500:
 *         description: Some server error
 */
async function getAllCourses(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await query(SELECT_ALL_COURSES);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Insert new Course
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses:
 *   post:
 *     summary: Creates new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       500:
 *         description: Some server error
 */
async function insertCourse(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await query(INSERT_COURSE, [
    req.body.name,
    req.body.professor_id,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * 
 */
const router: Router = Router();

router.get(
  "/",
  getAllCourses,
);

router.post(
  "/",
  [
    body("professor_id").isNumeric().isInt({ min: 1 }),
    body("name").notEmpty().trim().escape(),
  ],
  insertCourse,
);

export { router };
