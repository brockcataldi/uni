/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The Courses Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { insert, select } from "../database";
import {
  INSERT_COURSE,
  INSERT_ENROLLMENT,
  SELECT_ALL_COURSES,
  SELECT_ALL_STUDENTS_BY_ENROLLMENT,
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
async function getCourses(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(SELECT_ALL_COURSES);

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

  const { result, value } = await insert(INSERT_COURSE, [
    req.body.name,
    req.body.professor_id,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  // This conditional is redundant but it makes typescript happy.
  if (typeof value[0] !== "string") {
    res.json({
      course_id: value[0].insertId,
    });
  }
  return;
}

/**
 * Get enrollments by courseId
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Creates new enrollment
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to get
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

  const { result, value } = await insert(INSERT_ENROLLMENT, [
    req.body.student_id,
    req.params.courseId,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  // This conditional is redundant but it makes typescript happy.
  if (typeof value[0] !== "string") {
    res.json({
      enrollment_id: value[0].insertId,
    });
  }
  return;
}

/**
 * Get Enrollments by Course
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses/{courseId}/enrollments:
 *   get:
 *     summary: Get course with enrollments
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to get
 *     responses:
 *       200:
 *         description: All of the enrollments within the given course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollments'
 *       500:
 *         description: Some server error
 */
async function getCourseEnrollments(
  req: Request,
  res: Response,
): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(SELECT_ALL_STUDENTS_BY_ENROLLMENT, [
    req.params.courseId,
  ]);

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}


/**
 * Get enrollments by courseId
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses/{courseId}/grade/{studentId}:
 *   post:
 *     summary: Creates new enrollment
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to upsert
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the studentId to upsert
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
async function insertGrade(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  // get enrollment id by student id and course id

  const enrolledQuery = await select(`
    SELECT enrollments.enrollment_id, grades.grade_id
    FROM enrollments
    LEFT JOIN grades
      ON enrollments.enrollment_id = grades.enrollment_id
    WHERE course_id = ? AND student_id = ?
    LIMIT 1;
  `, [req.params.courseId, req.params.studentId]);

  if (!enrolledQuery.result) {
    res.status(500).json({ errors: [enrolledQuery.value] });
    return;
  }

  if(typeof enrolledQuery.value === 'string'){
    res.status(500).json({ errors: [enrolledQuery.value] });
    return;
  }
  const enrolledRow = enrolledQuery.value[0]

  if(enrolledRow.length === 0){
    res.status(500).json({ errors: ["Student isn't enrolled in that Class"] });
    return;
  }

  const {enrollment_id, grade_id} = enrolledRow[0] as { enrollment_id: number, grade_id: number | null};

  if(grade_id === null){
    const { result, value } = await insert(`
      INSERT INTO grades (enrollment_id, grade)
      VALUES (?, ?)
  `, [
      enrollment_id,
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

  const { result, value } = await insert(`
    UPDATE grades
    SET grade = ? 
    WHERE enrollment_id = ?
`, [
    req.body.grade,
    enrollment_id,
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
 * Get Enrollments by Grade
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses/{courseId}/grades:
 *   get:
 *     summary: Get a cource's grades
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to get
 *     responses:
 *       200:
 *         description: All of the enrollments within the given course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollments'
 *       500:
 *         description: Some server error
 */
async function getCourseGrades(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(
    `
    SELECT * 
    FROM students 
    INNER JOIN enrollments 
      ON students.student_id = enrollments.student_id 
    LEFT JOIN grades
      ON enrollments.enrollment_id = grades.enrollment_id
    WHERE enrollments.course_id = ?
`,
    [req.params.courseId],
  );

  if (!result) {
    res.status(500).json({ errors: [value] });
    return;
  }

  res.json(value[0]);
  return;
}

/**
 * Get Enrollments by Course
 *
 * @param req Request
 * @param res Response
 * @returns void
 *
 * @swagger
 * /courses/{courseId}/average:
 *   get:
 *     summary: Get a cource's grades
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to get
 *     responses:
 *       200:
 *         description: The course average
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollments'
 *       500:
 *         description: Some server error
 */
async function getCourseAverage(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(
    `
      SELECT AVG(grades.grade)
      FROM grades 
      INNER JOIN enrollments
        ON enrollments.enrollment_id = grades.enrollment_id
      WHERE enrollments.course_id = ?
  `,
    [req.params.courseId],
  );

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

// GET /courses/
router.get("/", getCourses);

// POST /courses/
router.post(
  "/",
  [
    body("professor_id").isNumeric().isInt({ min: 1 }),
    body("name").notEmpty().trim().escape(),
  ],
  insertCourse,
);

// POST /courses/{courseId}/enroll
router.post(
  "/:courseId/enroll",
  [
    body("student_id").isNumeric().isInt({ min: 1 }),
    param("courseId").isNumeric().isInt({ min: 1 }),
  ],
  insertEnrollment,
);

// GET /courses/{courseId}/enrollments
router.get(
  "/:courseId/enrollments",
  [param("courseId").isNumeric().isInt({ min: 1 })],
  getCourseEnrollments,
);

// POST /courses/{courseId}/grade/:studentId
router.post(
  "/:courseId/grade/:studentId",
  [
    body("grade").isNumeric().isInt({ min: 0, max: 100 }),
    param("courseId").isNumeric().isInt({ min: 1 }),
    param("studentId").isNumeric().isInt({ min: 1 })
  ],
  insertGrade,
);

// GET /courses/{courseId}/grades
router.get(
  "/:courseId/grades",
  [param("courseId").isNumeric().isInt({ min: 1 })],
  getCourseGrades,
);

// GET /courses/{courseId}/average
router.get(
  "/:courseId/average",
  [param("courseId").isNumeric().isInt({ min: 1 })],
  getCourseAverage,
);

export { router };
