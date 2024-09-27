import { ValidationError } from "express-validator";

import { tableExists, upsert } from "./database";

import config from "../config.json";

/**
 * Formatting Validator errors to be more inline with the IError interface
 *
 * @param errors ValidationError[]
 * @returns string[]
 */
export function formatErrors(errors: ValidationError[]): string[] {
  return errors.map((value) => {
    if ("path" in value) {
      return `${value.path} - ${value.msg}`;
    }

    return value.msg;
  });
}

/**
 * Initialize the database and server
 */
export async function initialize() {
  let tablesCreated = 0;

  if (!(await tableExists("students"))) {
    const { result } = await upsert(`
      CREATE TABLE students (
          student_id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    if (result === true) {
      tablesCreated++;
    } else {
      console.error("[error]: There was an issue creating the students table");
    }
  }
  if (!(await tableExists("professors"))) {
    const { result } = await upsert(`
    CREATE TABLE professors (
        professor_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`);

    if (result === true) {
      tablesCreated++;
    } else {
      console.error(
        "[error]: There was an issue creating the professors table",
      );
    }
  }
  if (!(await tableExists("courses"))) {
    const { result } = await upsert(`
    CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor_id BIGINT UNSIGNED REFERENCES professors(professor_id)
    );
`);

    if (result === true) {
      tablesCreated++;
    } else {
      console.error("[error]: There was an issue creating the courses table");
    }
  }
  if (!(await tableExists("enrollments"))) {
    const { result } = await upsert(`
    CREATE TABLE enrollments (
        enrollment_id SERIAL PRIMARY KEY,
        student_id BIGINT UNSIGNED REFERENCES students(student_id),
        course_id BIGINT UNSIGNED REFERENCES courses(course_id),
        UNIQUE(student_id, course_id)
    );
`);

    if (result === true) {
      tablesCreated++;
    } else {
      console.error(
        "[error]: There was an issue creating the enrollments table",
      );
    }
  }
  if (!(await tableExists("grades"))) {
    const { result } = await upsert(`
    CREATE TABLE grades (
        grade_id SERIAL PRIMARY KEY,
        enrollment_id BIGINT UNSIGNED REFERENCES enrollments(enrollment_id),
        grade DECIMAL(5,2) CHECK(grade >= 0 AND grade <= 100)
    );
`);

    if (result === true) {
      tablesCreated++;
    } else {
      console.error(
        "[error]: There was an issue creating the enrollments table",
      );
    }
  }
  console.log(`[server]: ${tablesCreated} Tables Created`);
  console.log(
    `[server]: Server is running at http://localhost:${config.server.port}`,
  );
}
