/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - professor_id
 *         - name
 *         - email
 *       properties:
 *         professor_id:
 *           type: string
 *           description: The auto-generated id of the professor
 *         name:
 *           type: string
 *           description: The name of the Professor
 *         email:
 *           type: string
 *           description: The Professor's email
 *       example:
 *         professor_id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 *     Professors:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Professor'
 *       example:
 *         - professor_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 *     ProfessorRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the Professor
 *         email:
 *           type: string
 *           description: The Professor's email
 *       example:
 *         name: Example Exampleton
 *         email: example@example.com
 */
/**
 * @swagger
 * tags:
 *   name: Professors
 *   description: The Professors Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { query } from "../database";
import {
  INSERT_PROFESSOR,
  SELECT_ALL_COURSES_BY_PROF,
  SELECT_ALL_PROFESSORS,
  SELECT_ONE_PROFESSOR_ID,
} from "../queries";

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
 *               $ref: '#/components/schemas/Professors'
 *       500:
 *         description: Some server error
 */
async function getAllProfessors(req: Request, res: Response) {
  const { result, value } = await query(SELECT_ALL_PROFESSORS);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
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
 *               $ref: '#/components/schemas/Professors'
 *       500:
 *         description: Some server error
 */
async function getProfessor(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await query(SELECT_ONE_PROFESSOR_ID, [
    req.params.professorId,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
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
 *     summary: Gets all the courses for one professor
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
 *               $ref: '#/components/schemas/Courses'
 *       500:
 *         description: Some server error
 */
async function getProfessorCourses(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { result, value } = await query(SELECT_ALL_COURSES_BY_PROF, [
        req.params.professorId,
    ]);

    if (!result) {
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
 *             $ref: '#/components/schemas/ProfessorRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       500:
 *         description: Some server error
 */
async function insertProfessor(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await query(INSERT_PROFESSOR, [
    req.body.name,
    req.body.email,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Professors Router 
 */
const router: Router = Router();
router.get("/", getAllProfessors);
router.get(
  "/:professorId",
  [param("professorId").isNumeric().notEmpty()],
  getProfessor,
);
router.get(
    "/:professorId/courses",
    [param("professorId").isNumeric().notEmpty()],
    getProfessorCourses,
  );
router.post(
  "/",
  [
    body("name").notEmpty().trim().escape(),
    body("email").isEmail().trim().escape(),
  ],
  insertProfessor,
);

export { router };
