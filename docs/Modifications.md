# Instruction Modifications

I had to modify the foreign key constraint to actually get 
this to work with MySQL, from `INT` to `BIGINT UNSIGNED`.

```sql
-- Table for storing courses
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    professor_id BIGINT UNSIGNED REFERENCES professors(professor_id)
);

-- Table for managing enrollments 
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id BIGINT UNSIGNED REFERENCES students(student_id),
    course_id BIGINT UNSIGNED REFERENCES courses(course_id),
    UNIQUE(student_id, course_id) -- Ensures a student can't enroll in the same course twice
);

-- Table for storing grades
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    enrollment_id BIGINT UNSIGNED REFERENCES enrollments(enrollment_id),
    grade DECIMAL(5,2) CHECK(grade >= 0 AND grade <= 100) -- Grades are from 0 to 100
);
```