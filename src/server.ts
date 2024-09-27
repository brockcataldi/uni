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

export async function initialize() {
  // I am having a moral conundrum between
  // the look of doing this via a for-loop
  // and handwriting if else statements
  // this might be the cleaner options

  if (!(await tableExists("students"))) {
    console.log(
      await upsert(`
    CREATE TABLE students (
        student_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`),
    );
  }
  if (!(await tableExists("professors"))) {
    console.log(
      await upsert(`
    CREATE TABLE professors (
        professor_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`),
    );
  }
  if (!(await tableExists("courses"))) {
    console.log(
      await upsert(`
    CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor_id BIGINT UNSIGNED REFERENCES professors(professor_id)
    );
`),
    );
  }
  if (!(await tableExists("enrollments"))) {
    console.log(
      await upsert(`
    CREATE TABLE enrollments (
        enrollment_id SERIAL PRIMARY KEY,
        student_id BIGINT UNSIGNED REFERENCES students(student_id),
        course_id BIGINT UNSIGNED REFERENCES courses(course_id),
        UNIQUE(student_id, course_id)
    );
`),
    );
  }
  if (!(await tableExists("grades"))) {
    console.log(
      await upsert(`
    CREATE TABLE grades (
        grade_id SERIAL PRIMARY KEY,
        enrollment_id BIGINT UNSIGNED REFERENCES enrollments(enrollment_id),
        grade DECIMAL(5,2) CHECK(grade >= 0 AND grade <= 100)
    );
`),
    );
  }

  console.log(
    `[server]: Server is running at http://localhost:${config.server.port}`,
  );
}
