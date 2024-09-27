/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The Students Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { upsert, select } from "../database";
import { formatErrors } from "../server";

/**
 * Get all students
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
 *               $ref: '#/components/schemas/IStudents'
 *       400:
 *         description: A Request Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 *       500:
 *         description: A Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 */
async function getAllStudents(req: Request, res: Response) {
  const { result, value } = await select(`SELECT * FROM students`);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Insert a Student
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
 *             $ref: '#/components/schemas/IStudentRequest'
 *     responses:
 *       200:
 *         description: The created Student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStudentInserted'
 *       400:
 *         description: A Request Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 *       500:
 *         description: A Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 */
async function insertStudent(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const existsQuery = await select(
    `
      SELECT * 
      FROM students 
      WHERE students.email = ?
      LIMIT 1;
    `,
    [req.body.email],
  );

  if (!existsQuery.result || typeof existsQuery.value === "string") {
    res.status(500).json({ errors: [existsQuery.value] });
    return;
  }

  if (existsQuery.value[0].length > 0) {
    res.status(500).json({ errors: ["Student already exists"] });
    return;
  }

  const insertQuery = await upsert(
    `
    INSERT INTO students (name, email)
    VALUES (?, ?)
`,
    [req.body.name, req.body.email],
  );

  if (!insertQuery.result || typeof insertQuery.value === "string") {
    res.status(500).json({ errors: [insertQuery.value] });
    return;
  }

  res.json({
    student_id: insertQuery.value[0].insertId,
  });
  return;
}

/**
 * Get one student
 *
 * @param req
 * @param res
 * @returns
 *
 * @swagger
 * /students/{studentId}:
 *   get:
 *     tags: [Students]
 *     summary: Get one student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the student to get
 *     responses:
 *       200:
 *         description: One student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStudent'
 *       400:
 *         description: A Request Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 *       500:
 *         description: A Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IError'
 */
async function getOneStudent(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const { result, value } = await select(
    `
      SELECT * 
      FROM students 
      WHERE student_id = ?
      LIMIT 1;
    `,
    [req.params.studentId],
  );

  if (!result || typeof value === "string") {
    res.status(500).json({ errors: [value] });
    return;
  }

  if (value[0].length === 0) {
    res.status(500).json({ errors: ["Student doesn't exist"] });
    return;
  }

  res.json(value[0][0]);
  return;
}

/**
 * Defining routes, validation and sanitization.
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
