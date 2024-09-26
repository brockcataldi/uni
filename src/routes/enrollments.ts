/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - enrollment_id
 *         - student_id
 *         - course_id
 *       properties:
 *         enrollment_id:
 *           type: int
 *           description: The auto-generated id of the professor
 *         student_id:
 *           type: int
 *           description: The id of the student
 *         course_id:
 *           type: string
 *           description: The id of the course
 *       example:
 *         enrollment_id: 1
 *         student_id: 1
 *         course_id: 1
 *     Enrollments:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Enrollment'
 *       example:
 *         - enrollment_id: 1
 *           student_id: 1
 *           course_id: 1
 *     EnrollmentRequest:
 *       type: object
 *       required:
 *         - student_id
 *         - course_id
 *       properties:
 *         student_id:
 *           type: int
 *           description: The id of the student
 *         course_id:
 *           type: int
 *           description: The id of the course
 *       example:
 *         student_id: 1
 *         course_id: 1
 */
/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: The Enrollments Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { query } from "../database";
import {
  INSERT_ENROLLMENT,
} from "../queries";

/**
 * Insert Enrollment
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Creates new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Some server error
 */
async function insertEnrollment(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await query(INSERT_ENROLLMENT, [
    req.body.student_id,
    req.body.course_id,
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
  [
    param("student_id").isNumeric().isInt({ min: 1 }).optional(),
  ]
)

router.post(
  "/",
  [
    body("student_id").isNumeric().isInt({ min: 1 }),
    body("course_id").isNumeric().isInt({ min: 1 }),
  ],
  insertEnrollment,
);

export { router };
