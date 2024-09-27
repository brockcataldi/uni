/**
 * This file isn't used persay it's more for schema generation, plus if I were to expand this,
 * I'd lean into the typesystem more.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     IError:
 *       type: object
 *       required:
 *         - errors
 *       properties:
 *         errors:
 *           type: array
 *           description: The api errors encountered.
 *           items:
 *              type: string
 *              description: An error
 *       example:
 *         errors:
 *           - An error occured
 */
interface IError {
  errors: string[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IStudent:
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
 */
interface IStudent {
  student_id: number;
  name: string;
  email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IStudents:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IStudent'
 *       example:
 *         - student_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 */
type IStudents = IStudent[];

/**
 * @swagger
 * components:
 *   schemas:
 *     IStudentRequest:
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
 */
interface IStudentRequest {
  name: string;
  email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IStudentInserted:
 *       type: object
 *       required:
 *         - student_id
 *       properties:
 *         student_id:
 *           type: int
 *           description: The id of the inserted Student
 *       example:
 *         student_id: 1
 */
interface IStudentInserted {
  student_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessor:
 *       type: object
 *       required:
 *         - professor_id
 *         - name
 *         - email
 *       properties:
 *         professor_id:
 *           type: int
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
 */
interface IProfessor {
  professor_id: number;
  name: string;
  email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessors:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IProfessor'
 *       example:
 *         - professor_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 */
type IProfessors = IProfessor[];

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessorRequest:
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
interface IProfessorRequest {
  name: string;
  email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessorInserted:
 *       type: object
 *       required:
 *         - professor_id
 *       properties:
 *         professor_id:
 *           type: int
 *           description: The id of the inserted Professor
 *       example:
 *         professor_id: 1
 */
interface IProfessorInserted {
  professor_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessorCourse:
 *       type: object
 *       required:
 *         - professor_id
 *         - name
 *         - email
 *         - course_id
 *         - course_name
 *       properties:
 *         professor_id:
 *           type: int
 *           description: The auto-generated id of the professor
 *         name:
 *           type: string
 *           description: The name of the Professor
 *         email:
 *           type: string
 *           description: The Professor's email
 *         course_id:
 *           type: int
 *           description: The auto-generated id of the course
 *         course_name:
 *           type: string
 *           description: The name of the course
 *       example:
 *         professor_id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 *         course_id: 1
 *         course_name: Course Name
 */
interface IProfessorCourse {
  professor_id: number;
  name: string;
  email: string;
  course_id: number;
  course_name: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IProfessorCourses:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IProfessorCourse'
 *       example:
 *         - professor_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 *           course_id: 1
 *           course_name: Course Name
 */
type IProfessorCourses = IProfessorCourse[];

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourse:
 *       type: object
 *       required:
 *         - course_id
 *         - course_name
 *         - professor_id
 *       properties:
 *         course_id:
 *           type: int
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
 */
interface ICourse {
  course_id: number;
  course_name: string;
  professor_id: number;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseFull:
 *       type: object
 *       required:
 *         - course_id
 *         - course_name
 *         - professor_id
 *         - name
 *         - email
 *       properties:
 *         course_id:
 *           type: int
 *           description: The auto-generated id of the course
 *         course_name:
 *           type: string
 *           description: The name of the Course
 *         professor_id:
 *           type: int
 *           description: The Professor's ID
 *         name:
 *           type: string
 *           description: The name of the Professor
 *         email:
 *           type: string
 *           description: The email of the Professor
 *       example:
 *         course_id: 1
 *         course_name: Example's Class on Racoons
 *         professor_id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 */
interface ICourseFull {
  course_id: number;
  course_name: string;
  professor_id: number;
  name: string;
  email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourses:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ICourse'
 *       example:
 *         - course_id: 1
 *           course_name: Example's Class on Racoons
 *           professor_id: 1
 */
type ICourses = ICourse[];

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseFulls:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ICourseFull'
 *       example:
 *         - course_id: 1
 *           course_name: Example's Class on Racoons
 *           professor_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 */
type ICourseFulls = ICourseFull[];

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseRequest:
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
interface ICourseRequest {
  name: string;
  professor_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseInserted:
 *       type: object
 *       required:
 *         - course_id
 *       properties:
 *         course_id:
 *           type: int
 *           description: The id of the inserted Professor
 *       example:
 *         course_id: 1
 */
interface ICourseInserted {
  course_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollment:
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
 */
interface IEnrollment {
  enrollment_id: number;
  student_id: number;
  course_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollmentFull:
 *       type: object
 *       required:
 *         - enrollment_id
 *         - student_id
 *         - course_id
 *         - name
 *         - email
 *       properties:
 *         enrollment_id:
 *           type: int
 *           description: The auto-generated id of the professor
 *         student_id:
 *           type: int
 *           description: The id of the student
 *         course_id:
 *           type: int
 *           description: The id of the course
 *         name:
 *           type: string
 *           description: The name of the enrolled student
 *         email:
 *           type: string
 *           description: The email of the enrolled student
 *       example:
 *         enrollment_id: 1
 *         student_id: 1
 *         course_id: 1
 */
interface IEnrollmentFull {
  enrollment_id: number;
  student_id: number;
  course_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollments:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IEnrollment'
 *       example:
 *         - enrollment_id: 1
 *           student_id: 1
 *           course_id: 1
 */
type IEnrollments = IEnrollment[];

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollmentFulls:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/IEnrollmentFull'
 *       example:
 *         - enrollment_id: 1
 *           student_id: 1
 *           course_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 */
type IEnrollmentFulls = IEnrollmentFull[];

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollmentRequest:
 *       type: object
 *       required:
 *         - student_id
 *       properties:
 *         student_id:
 *           type: int
 *           description: The id of the student
 *       example:
 *         student_id: 1
 */
interface IEnrollmentRequest {
  student_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IEnrollmentInserted:
 *       type: object
 *       required:
 *         - enrollment_id
 *       properties:
 *         enrollment_id:
 *           type: int
 *           description: The id of the inserted Professor
 *       example:
 *         enrollment_id: 1
 */
interface IEnrollmentInserted {
  enrollment_id: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseGrade:
 *       type: object
 *       required:
 *         - student_id
 *         - name
 *         - email
 *         - enrollment_id
 *         - course_id
 *         - grade_id
 *         - grade
 *       properties:
 *         student_id:
 *           type: int
 *           description: The id of the student
 *         enrollment_id:
 *           type: int
 *           description: The id of the enrollment
 *         course_id:
 *           type: int
 *           description: The id of the course
 *         grade_id:
 *           type: int
 *           description: The id of the grade
 *         name:
 *           type: string
 *           description: The name of the student
 *         email:
 *           type: string
 *           description: The email of the student
 *         grade:
 *           type: string
 *           description: The grade of the student
 *       example:
 *         student_id: 1
 *         enrollment_id: 1
 *         course_id: 1
 *         grade_id: 1
 *         name: Example Exampleton
 *         email: example@example.com
 *         grade: 100
 */
interface ICourseGrade {
  student_id: number;
  enrollment_id: number;
  course_id: number;
  grade_id: number;
  name: string;
  email: string;
  grade: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseGrades:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ICourseGrade'
 *       example:
 *         - student_id: 1
 *           enrollment_id: 1
 *           course_id: 1
 *           grade_id: 1
 *           name: Example Exampleton
 *           email: example@example.com
 *           grade: 100
 */
type ICourseGrades = ICourseGrade[];

/**
 * @swagger
 * components:
 *   schemas:
 *     IGradeRequest:
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
interface IGradeRequest {
  grade: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IGradeUpserted:
 *       type: object
 *       properties:
 *         grade_id:
 *           type: int
 *           description: The Inserted Grade Id
 *         updated:
 *           type: int
 *           description: If the row was updated rather than inserted
 *       example:
 *         grade_id: 1
 */
interface IGradeUpserted {
  grade_id?: number;
  updated?: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ICourseAverage:
 *       type: object
 *       properties:
 *         average:
 *           type: int
 *           description: The course average
 *       example:
 *         average: 100
 */
interface ICourseAverage {
  average: number;
}

export type {
  ICourse,
  ICourseAverage,
  ICourseFull,
  ICourseFulls,
  ICourseGrade,
  ICourseGrades,
  ICourseInserted,
  ICourseRequest,
  ICourses,
  IEnrollment,
  IEnrollmentFull,
  IEnrollmentFulls,
  IEnrollmentInserted,
  IEnrollmentRequest,
  IEnrollments,
  IError,
  IGradeRequest,
  IGradeUpserted,
  IProfessor,
  IProfessorCourse,
  IProfessorCourses,
  IProfessorInserted,
  IProfessorRequest,
  IProfessors,
  IStudent,
  IStudentInserted,
  IStudentRequest,
  IStudents,
};
