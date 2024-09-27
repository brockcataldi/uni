import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { insert } from "../database";

/**
 * Modify Grade
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /grades/{enrollmentId}:
 *   post:
 *     summary: Get course with grades and enrollment
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the enrollmentId to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeRequest'
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
async function insertGrade(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await insert(`
    INSERT INTO grades (enrollment_id, grade)
    VALUES (?, ?)
`, [
    req.params.enrollmentId,
    req.body.grade,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  if (typeof value[0] !== "string") {
    res.json({
      grade_id: value[0].insertId,
    });
  }
  return;
}

/**
 *
 */
const router: Router = Router();

// POST /grade/{enrollmentId}
router.post(
  "/:enrollmentId",
  [
    body("grade").isNumeric().isInt({ min: 0, max: 100 }),
    param("enrollmentId").isNumeric().isInt({ min: 1 }),
  ],
  insertGrade,
);

export { router };
