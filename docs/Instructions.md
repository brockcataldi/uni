# University Enrollment System

## Problem Description:
You have been hired to develop a system that manages student enrollments, course scheduling, and grade tracking for a university. 

## The system should allow the following:

* Students can view available courses.
* Students can enroll in courses.
* Professors can assign grades to students.
* An administrator can run a report that provides the average grade per course.


## Provided Database Schema:
You will work with the following pre-defined database schema. You do not need to design the schema but will be interacting with it through your application code.

```sql
-- Table for storing students
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Table for storing professors
CREATE TABLE professors (
    professor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Table for storing courses
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    professor_id INT REFERENCES professors(professor_id)
);

-- Table for managing enrollments 
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    course_id INT REFERENCES courses(course_id),
    UNIQUE(student_id, course_id) -- Ensures a student can't enroll in the same course twice
);

-- Table for storing grades
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    enrollment_id INT REFERENCES enrollments(enrollment_id),
    grade DECIMAL(5,2) CHECK(grade >= 0 AND grade <= 100) -- Grades are from 0 to 100
);
```

## Task:

### API Development:
* Create API endpoints for the following:
    * List Available Courses: Provide a list of all courses and the professor teaching each course.
    * Enroll Student in a Course: Allow students to enroll in a course.
    * Assign Grade: Allow professors to assign grades to students in the courses they are teaching.
    * Get Average Grade: Provide a report showing the average grade for each course.

