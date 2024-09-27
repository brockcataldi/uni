/**
 * @swagger
 * tags:
 *   name: Professors
 *   description: The Professors Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { upsert, select } from "../database";
import { formatErrors } from "../server";

/**
 * Get all professorss
 *
 * @param req {Request}
 * @param res {Response}
 * @returns
 *
 * @swagger
 * /professors:
 *   get:
 *     summary: Get all professors
 *     tags: [Professors]
 *     responses:
 *       200:
 *         description: Returns all professors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfessors'
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
async function getAllProfessors(req: Request, res: Response) {
  const { result, value } = await select(
    `
    SELECT * FROM professors
    `,
  );

  if (!result || typeof value === "string") {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Insert a professor
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /professors:
 *   post:
 *     summary: Creates new professor
 *     tags: [Professors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IProfessorRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfessorInserted'
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
async function insertProfessor(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const existsQuery = await select(
    `
      SELECT * 
      FROM professors 
      WHERE professors.email = ?
      LIMIT 1;
    `,
    [req.body.email],
  );

  if (!existsQuery.result || typeof existsQuery.value === "string") {
    res.status(500).json({ errors: [existsQuery.value] });
    return;
  }

  if (existsQuery.value[0].length > 0) {
    res.status(500).json({ errors: ["Professor already exists"] });
    return;
  }

  const insertQuery = await upsert(
    `
      INSERT INTO professors (name, email)
      VALUES (?, ?)
   `,
    [req.body.name, req.body.email],
  );

  if (!insertQuery.result || typeof insertQuery.value === "string") {
    res.status(500).json({ errors: [insertQuery.value] });
    return;
  }

  res.json({
    professor_id: insertQuery.value[0].insertId,
  });
  return;
}

/**
 * Get one professor
 *
 * @param req
 * @param res
 * @returns
 *
 * @swagger
 * /professors/{professorId}:
 *   get:
 *     summary: Gets one professor
 *     parameters:
 *       - in: path
 *         name: professorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the professor to get
 *     tags: [Professors]
 *     responses:
 *       200:
 *         description: One professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfessor'
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
async function getProfessor(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const { result, value } = await select(
    `
      SELECT * 
      FROM professors 
      WHERE professor_id = ? 
      LIMIT 1;
    `,
    [req.params.professorId],
  );

  if (!result || typeof value === "string") {
    res.status(500).json({ errors: [value] });
    return;
  }

  if (value[0].length === 0) {
    res.status(500).json({ errors: ["Professor doesn't exist"] });
    return;
  }

  res.json(value[0][0]);
  return;
}

/**
 * Get one professor
 *
 * @param req
 * @param res
 * @returns
 *
 * @swagger
 * /professors/{professorId}/courses:
 *   get:
 *     tags: [Professors]
 *     summary: Gets all the courses for one professor
 *     parameters:
 *       - in: path
 *         name: professorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the professor to get
 *     responses:
 *       200:
 *         description: All of the professor's courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfessorCourses'
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
async function getProfessorCourses(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const { result, value } = await select(
    `
    SELECT * FROM courses 
    INNER JOIN professors 
    ON courses.professor_id = professors.professor_id
    WHERE courses.professor_id = ?
  `,
    [req.params.professorId],
  );

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Defining routes, validation and sanitization.
 */
const router: Router = Router();

// POST /professors/
router.get("/", getAllProfessors);

// POST /professors/
router.post(
  "/",
  [
    body("name").notEmpty().trim().escape(),
    body("email").isEmail().trim().escape(),
  ],
  insertProfessor,
);

// GET /professors/{professorId}
router.get(
  "/:professorId",
  [param("professorId").isNumeric().isInt({ min: 1 }).notEmpty()],
  getProfessor,
);

// GET /professors/{professorId}/courses
router.get(
  "/:professorId/courses",
  [param("professorId").isNumeric().isInt({ min: 1 }).notEmpty()],
  getProfessorCourses,
);

export { router };
