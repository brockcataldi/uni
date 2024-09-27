/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The Students Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { insert, select } from "../database";
import {
  INSERT_STUDENT,
  SELECT_ALL_STUDENTS,
  SELECT_ONE_STUDENT_ID,
} from "../queries";

/**
 * Returns all the students (I need to paginate this)
 *
 * @param req {Request}
 * @param res {Response}
 * @returns
 *
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Returns all students.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       500:
 *         description: Some server error
 */
async function getAllStudents(req: Request, res: Response) {
  const { result, value } = await select(SELECT_ALL_STUDENTS);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Returns one student (I need to paginate this)
 *
 * @param req
 * @param res
 * @returns
 *
 * @swagger
 * /students/{studentId}:
 *   get:
 *     summary: Gets one student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the student to get
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: One student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       500:
 *         description: Some server error
 */
async function getOneStudent(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(SELECT_ONE_STUDENT_ID, [
    req.params.studentId,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * POST Request to insert student
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /students:
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
 */
async function insertStudent(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await insert(INSERT_STUDENT, [
    req.body.name,
    req.body.email,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  if (typeof value[0] !== "string") {
    res.json({
      student_id: value[0].insertId,
    });
  }
  return;
}

/**
 *
 */
const router: Router = Router();

// GET /students/
router.get("/", getAllStudents);

// POST /students/
router.post(
  "/",
  [
    body("name").notEmpty().trim().escape(),
    body("email").isEmail().trim().escape(),
  ],
  insertStudent,
);

// GET /students/{studentId}
router.get(
  "/:studentId",
  [
    param("studentId")
      .isNumeric()
      .withMessage("ID must be a number")
      .isInt({ min: 1 })
      .notEmpty(),
  ],
  getOneStudent,
);

export { router };
