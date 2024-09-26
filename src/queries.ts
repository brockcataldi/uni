/**
 * Creates students table
 *
 * @constant {string}
 */
export const CREATE_TABLE_STUDENTS = `
    CREATE TABLE students (
        student_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`;

/**
 * Creates professors table
 *
 * @constant {string}
 */
export const CREATE_TABLE_PROFESSORS = `
    CREATE TABLE professors (
        professor_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`;

/**
 * Creates courses table
 *
 * @constant {string}
 */
export const CREATE_TABLE_COURSES = `
    CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor_id BIGINT UNSIGNED REFERENCES professors(professor_id)
    );
`;

/**
 * Creates enrollments table
 *
 * @constant {string}
 */
export const CREATE_TABLE_ENROLLMENTS = `
    CREATE TABLE enrollments (
        enrollment_id SERIAL PRIMARY KEY,
        student_id BIGINT UNSIGNED REFERENCES students(student_id),
        course_id BIGINT UNSIGNED REFERENCES courses(course_id),
        UNIQUE(student_id, course_id)
    );
`;

/**
 * Creates grades table
 *
 * @constant {string}
 */
export const CREATE_TABLE_GRADES = `
    CREATE TABLE grades (
        grade_id SERIAL PRIMARY KEY,
        enrollment_id BIGINT UNSIGNED REFERENCES enrollments(enrollment_id),
        grade DECIMAL(5,2) CHECK(grade >= 0 AND grade <= 100)
    );
`;

/**
 * Used to see if table exists
 *
 * Takes two placeholders:
 * 1. Database Name: {string}
 * 2. Table Name: {string}
 *
 * @constant {string}
 */
export const TABLE_EXISTS = `
    SELECT * 
    FROM information_schema.tables
    WHERE table_schema = ? 
    AND table_name = ?
    LIMIT 1;
`;

/**
 * Select all students (Migrate away from *)
 *
 * @constant {string}
 */
export const SELECT_ALL_STUDENTS = `SELECT * FROM students`;

/**
 * Select one student by ID
 *
 * Takes one placeholders:
 * 1. student_id: {number}
 *
 * @constant {string}
 */
export const SELECT_ONE_STUDENT_ID = `SELECT * FROM students WHERE student_id = ?`;

/**
 * Select one student by email
 *
 * Takes one placeholders:
 * 1. email: {string}
 *
 * @constant {string}
 */
export const SELECT_ONE_STUDENT_EMAIL = `SELECT * FROM students WHERE email = ?`;

/**
 * Insert Student
 *
 * Takes two placeholders:
 * 1. name: {string}
 * 2. email: {string}
 *
 * @constant {string}
 */
export const INSERT_STUDENT = `
    INSERT INTO students (name, email)
    VALUES (?, ?)
`;
