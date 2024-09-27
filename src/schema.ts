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
 *       properties:
 *         student_id:
 *           type: int
 *           description: The id of the student
 *       example:
 *         student_id: 1
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
 *         student_id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 *     Students:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Student'
 *       example:
 *         - student_id: 1
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
 *     GradeRequest:
 *       type: object
 *       required:
 *         - grade
 *       properties:
 *         grade:
 *           type: int
 *           description: The Grade
 *       example:
 *         grade: 100
 */
