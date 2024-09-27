# University Enrollment System

## Considerations

* I used *'s in the SELECT statements intentionally to show what is being delivered via each query, obviously not ideal for production it's more of until I know what the ideal return value is I'll return it all. 
* There isn't a user authentication flow nor an access control system, this is kind of in the open. 
* For time constraints I went with a code duplication rather than overt abstraction. I feel as if it's easier to diagnose with duplication, and if I were to refine this, I'd abstract significantly more.
* Along with if the logic demands it, I'd leverage the type system more. 

## Required Software

```
docker: latest
node v22.8.0
npm v10.8.3
```

## Commands

To start the database. 
```bash
docker-compose up
```

To run a development server.
```bash
npm run dev
```

To build the system.
```bash
npm run build
```

To serve the built files
```bash
npm run start
```

## URLs

* http://localhost:3000/docs - Swagger (Testing and Documentation)
* http://localhost:8080 - phpMyAdmin (If you want to look at the Database)

## Instruction Modifications

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