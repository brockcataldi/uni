/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The Courses Endpoint
 */
import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { upsert, select } from "../database";
import { formatErrors } from "../server";

/**
 * Returns all courses
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
 *         description: Returns all courses.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICourseFulls'
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
async function getCourses(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { result, value } = await select(`
       SELECT * 
       FROM courses 
       INNER JOIN professors 
       ON courses.professor_id = professors.professor_id
   `);

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
 *             $ref: '#/components/schemas/ICourseRequest'
 *     responses:
 *       200:
 *         description: The created course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICourseInserted'
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
async function insertCourse(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const professorQuery = await select(
    `SELECT * FROM professors WHERE professor_id = ?`,
    [req.body.professor_id],
  );

  if (!professorQuery.result || typeof professorQuery.value === "string") {
    res.status(500).json({ errors: [professorQuery.value] });
    return;
  }

  if (professorQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Professor doesn't exist"] });
    return;
  }

  const courseQuery = await upsert(
    `
      INSERT INTO courses (course_name, professor_id)
      VALUES (?, ?)
    `,
    [req.body.name, req.body.professor_id],
  );

  if (!courseQuery.result || typeof courseQuery.value === "string") {
    res.status(500).json({ errors: [courseQuery.value] });
    return;
  }

  res.json({
    course_id: courseQuery.value[0].insertId,
  });
  return;
}

/**
 * Insert Enrollment
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
 *             $ref: '#/components/schemas/IEnrollmentRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEnrollmentInserted'
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
async function insertEnrollment(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const studentQuery = await select(
    `SELECT * FROM students WHERE student_id = ? LIMIT 1;`,
    [req.body.student_id],
  );

  if (!studentQuery.result || typeof studentQuery.value === "string") {
    res.status(500).json({ errors: [studentQuery.value] });
    return;
  }

  if (studentQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Student doesn't exist"] });
    return;
  }

  const courseQuery = await select(
    `SELECT * FROM courses WHERE course_id = ? LIMIT 1;`,
    [req.params.courseId],
  );

  if (!courseQuery.result || typeof courseQuery.value === "string") {
    res.status(500).json({ errors: [courseQuery.value] });
    return;
  }

  if (courseQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Course doesn't exist"] });
    return;
  }

  const existsQuery = await select(
    `SELECT * FROM enrollments WHERE course_id = ? AND student_id = ? LIMIT 1;`,
    [req.params.courseId, req.body.student_id],
  );

  if (!existsQuery.result || typeof existsQuery.value === "string") {
    res.status(500).json({ errors: [existsQuery.value] });
    return;
  }

  if (existsQuery.value[0].length > 0) {
    res.status(500).json({ errors: ["Student is already enrolled"] });
    return;
  }

  const enrollmentQuery = await upsert(
    `
      INSERT INTO enrollments (student_id, course_id)
      VALUES (?, ?)
    `,
    [req.body.student_id, req.params.courseId],
  );

  if (!enrollmentQuery.result || typeof enrollmentQuery.value === "string") {
    res.status(500).json({ errors: [enrollmentQuery.value] });
    return;
  }

  res.json({
    enrollment_id: enrollmentQuery.value[0].insertId,
  });
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
 *               $ref: '#/components/schemas/IEnrollmentFulls'
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
async function getCourseEnrollments(
  req: Request,
  res: Response,
): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const courseQuery = await select(
    `SELECT * FROM courses WHERE course_id = ? LIMIT 1;`,
    [req.params.courseId],
  );

  if (!courseQuery.result || typeof courseQuery.value === "string") {
    res.status(500).json({ errors: [courseQuery.value] });
    return;
  }

  if (courseQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Course doesn't exist"] });
    return;
  }

  const enrollmentQuery = await select(
    `
    SELECT * 
    FROM students 
    INNER JOIN enrollments 
    ON students.student_id = enrollments.student_id 
    WHERE enrollments.course_id = ?
`,
    [req.params.courseId],
  );

  if (!enrollmentQuery.result || typeof enrollmentQuery.value === "string") {
    res.status(500).json({ errors: [enrollmentQuery.value] });
    return;
  }

  res.json(enrollmentQuery.value[0]);
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
 *     summary: Inserts or Updates a student's grade.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to apply the grade to
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the studentId to apply the grade to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IGradeRequest'
 *     responses:
 *       200:
 *         description: The created Professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IGradeUpserted'
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
async function insertGrade(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const enrolledQuery = await select(
    `
    SELECT enrollments.enrollment_id, grades.grade_id
    FROM enrollments
    LEFT JOIN grades
      ON enrollments.enrollment_id = grades.enrollment_id
    WHERE course_id = ? AND student_id = ?
    LIMIT 1;
  `,
    [req.params.courseId, req.params.studentId],
  );

  if (!enrolledQuery.result || typeof enrolledQuery.value === "string") {
    res.status(500).json({ errors: [enrolledQuery.value] });
    return;
  }

  const enrolledRow = enrolledQuery.value[0];

  if (enrolledRow.length === 0) {
    res.status(500).json({ errors: ["Student isn't enrolled in that Class"] });
    return;
  }

  const { enrollment_id, grade_id } = enrolledRow[0] as {
    enrollment_id: number;
    grade_id: number | null;
  };

  if (grade_id === null) {
    const insertQuery = await upsert(
      `
      INSERT INTO grades (enrollment_id, grade)
      VALUES (?, ?)
  `,
      [enrollment_id, req.body.grade],
    );

    if (!insertQuery.result || typeof insertQuery.value === "string") {
      res.status(500).json({ errors: [insertQuery.value] });
      return;
    }

    res.json({
      grade_id: insertQuery.value[0].insertId,
    });
    return;
  }

  const updateQuery = await upsert(
    `
    UPDATE grades
    SET grade = ? 
    WHERE enrollment_id = ?
`,
    [req.body.grade, enrollment_id],
  );

  if (!updateQuery.result || typeof updateQuery.value === "string") {
    res.status(500).json({ errors: [updateQuery.value] });
    return;
  }

  res.json({
    updated: updateQuery.value[0].affectedRows === 1,
  });
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
 *         description: All of the students and their grades.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICourseGrades'
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
async function getCourseGrades(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors.array()) });
    return;
  }

  const courseQuery = await select(
    `SELECT * FROM courses WHERE course_id = ? LIMIT 1;`,
    [req.params.courseId],
  );

  if (!courseQuery.result || typeof courseQuery.value === "string") {
    res.status(500).json({ errors: [courseQuery.value] });
    return;
  }

  if (courseQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Course doesn't exist"] });
    return;
  }

  const gradesQuery = await select(
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

  if (!gradesQuery.result || typeof gradesQuery.value === "number") {
    res.status(500).json({ errors: [gradesQuery.value] });
    return;
  }

  res.json(gradesQuery.value[0]);
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
 *     summary: Get the average grade of the course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the courseId to average
 *     responses:
 *       200:
 *         description: The course average
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICourseAverage'
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
async function getCourseAverage(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const courseQuery = await select(
    `SELECT * FROM courses WHERE course_id = ? LIMIT 1;`,
    [req.params.courseId],
  );

  if (!courseQuery.result || typeof courseQuery.value === "string") {
    res.status(500).json({ errors: [courseQuery.value] });
    return;
  }

  if (courseQuery.value[0].length === 0) {
    res.status(500).json({ errors: ["Course doesn't exist"] });
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

  // Typescript has some weird moments like this one.
  const average = (value[0][0] as { "AVG(grades.grade)": number })[
    "AVG(grades.grade)"
  ];

  res.json({ average });
  return;
}

/**
 * Defining routes, validation and sanitization.
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
    param("studentId").isNumeric().isInt({ min: 1 }),
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
