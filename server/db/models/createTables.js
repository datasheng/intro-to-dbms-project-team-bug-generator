const queries = [
  {
    name: "User",
    query: `
            CREATE TABLE IF NOT EXISTS User (
                user_id CHAR(36) PRIMARY KEY,
                full_name VARCHAR(255),
                email VARCHAR(255),
                password VARCHAR(255)
            )
        `,
  },
  {
    name: "Course",
    query: `
            CREATE TABLE IF NOT EXISTS Course (
                course_id CHAR(36) PRIMARY KEY,
                instructor_id CHAR(36),
                course_name VARCHAR(255),
                course_description VARCHAR(255),
                course_details TEXT,
                course_price DECIMAL(10, 2),
                FOREIGN KEY (instructor_id) REFERENCES User(user_id)
            )
        `,
  },
  {
    name: "Enrollment",
    query: `
            CREATE TABLE IF NOT EXISTS Enrollment (
                enrollment_id CHAR(36) PRIMARY KEY,
                course_id CHAR(36),
                student_id CHAR(36),
                enrollment_status VARCHAR(20),
                enrollment_date INT,
                FOREIGN KEY (course_id) REFERENCES Course(course_id),
                FOREIGN KEY (student_id) REFERENCES User(user_id)
            )
        `,
  },
  {
    name: "Lesson",
    query: `
            CREATE TABLE IF NOT EXISTS Lesson (
                lesson_id CHAR(36) PRIMARY KEY,
                course_id CHAR(36),
                lesson_number INT,
                lesson_title VARCHAR(255),
                lesson_description VARCHAR(255),
                FOREIGN KEY (course_id) REFERENCES Course(course_id)
            )
        `,
  },
  {
    name: "Content",
    query: `
            CREATE TABLE IF NOT EXISTS Content (
                content_id CHAR(36) PRIMARY KEY,
                lesson_id CHAR(36),
                content_type VARCHAR(10),
                content_url VARCHAR(255),
                content_text TEXT,
                FOREIGN KEY (lesson_id) REFERENCES Lesson(lesson_id)
            )
        `,
  },
  {
    name: "Sale",
    query: `
            CREATE TABLE IF NOT EXISTS Sale (
                sale_id CHAR(36) PRIMARY KEY,
                student_id CHAR(36),
                instructor_id CHAR(36),
                course_id CHAR(36),
                sale_date INT,
                sale_price DECIMAL(10, 2),
                FOREIGN KEY (student_id) REFERENCES User(user_id),
                FOREIGN KEY (instructor_id) REFERENCES User(user_id),
                FOREIGN KEY (course_id) REFERENCES Course(course_id)
            )
        `,
  },
];

module.exports = queries;
