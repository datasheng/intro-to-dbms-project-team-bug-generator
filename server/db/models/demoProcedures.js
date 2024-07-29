const sampleDataProcedure = `
CREATE PROCEDURE IF NOT EXISTS AddSampleData()
BEGIN

    DECLARE userCount INT;
    DECLARE courseCount INT;

    SELECT COUNT(*) INTO userCount FROM User;
    SELECT COUNT(*) INTO courseCount FROM Course;

    IF userCount = 0 THEN
        -- Sample user accounts
        INSERT INTO User (user_id, full_name, email, password) VALUES
        ('11111111-1111-1111-1111-111111111111', 'John Doe', 'johndoe@gmail.com', NULL),
        ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'janesmith@gmail.com', NULL),
        ('33333333-3333-3333-3333-333333333333', 'Alice Johnson', 'alicejohnson@gmail.com', NULL),
        ('44444444-4444-4444-4444-444444444444', 'Bob Brown', 'bobbrown@gmail.com', NULL),
        ('55555555-5555-5555-5555-555555555555', 'Charlie Davis', 'charliedavis@gmail.com', NULL),
        ('66666666-6666-6666-6666-666666666666', 'David Edwards', 'davidedwards@gmail.com', NULL),
        ('77777777-7777-7777-7777-777777777777', 'Emma Wilson', 'emmawilson@gmail.com', NULL),
        ('88888888-8888-8888-8888-888888888888', 'Frank Thomas', 'frankthomas@gmail.com', NULL),
        ('99999999-9999-9999-9999-999999999999', 'Grace Lee', 'gracelee@gmail.com', NULL),
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Henry Walker', 'henrywalker@gmail.com', NULL);
    END IF;

    IF courseCount = 0 THEN
        -- Insert Courses with detailed descriptions
        INSERT INTO Course (course_id, instructor_id, course_name, course_description, course_details, course_price) VALUES
        ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Introduction to Programming', 'Learn the basics of programming.', 'This course introduces the fundamentals of programming. Topics include variables, data types, control structures, functions, and basic algorithms. New content will be added weekly, with a mix of video lectures, coding assignments, and quizzes. The course will be graded based on assignments and a final project.', 0.00),
        ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Advanced Python', 'Master advanced concepts in Python.', 'Dive deep into advanced Python concepts such as data structures, decorators, generators, concurrency, and parallelism. The course includes weekly updates with video tutorials, coding exercises, and peer-reviewed assignments. Grading will be based on project work and a final exam.', 99.99),
        ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Data Science Fundamentals', 'A comprehensive guide to data science.', 'This comprehensive course covers the essentials of data science, including data preprocessing, analysis, and visualization. Topics include Python for data science, Pandas, NumPy, and Matplotlib. Weekly content updates include lectures, labs, and real-world case studies. Students will be graded on homework, projects, and exams.', 0.00),
        ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Machine Learning 101', 'An introduction to machine learning.', 'Explore the basics of machine learning, including supervised and unsupervised learning, regression, classification, and clustering. The course features weekly updates with interactive content, coding assignments, and quizzes. Grading will be based on practical assignments and a capstone project.', 79.99),
        ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Web Development Basics', 'Get started with web development.', 'Learn the foundations of web development, covering HTML, CSS, and JavaScript. The course includes weekly lessons, coding challenges, and hands-on projects. Students will create a portfolio of web projects by the end of the course. Grading is based on project submissions and a final assessment.', 0.00),
        ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'React for Beginners', 'Learn the basics of React.js.', 'Understand the core concepts of React.js, including components, state, props, and hooks. Weekly content includes video tutorials, coding exercises, and project-based learning. The course will be graded based on the completion of projects and a final project presentation.', 49.99),
        ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Database Management', 'Understanding database concepts.', 'Gain a solid understanding of database management systems, SQL, and database design principles. Weekly lessons cover theoretical and practical aspects, with quizzes and assignments to reinforce learning. Grading is based on quizzes, assignments, and a final project.', 0.00),
        ('99999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'Cybersecurity Essentials', 'Introduction to cybersecurity principles.', 'An introductory course on cybersecurity, covering threats, vulnerabilities, and basic security practices. Weekly updates include video lectures, labs, and case studies. Grading is based on lab work, quizzes, and a final exam.', 0.00),
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Network Security', 'Learn about securing networks.', 'Understand the principles of network security, including protocols, firewalls, and intrusion detection systems. The course features weekly lessons, hands-on labs, and projects. Grading is based on lab assignments, project work, and a final exam.', 59.99);

        -- Lesson Table Inserts
        INSERT INTO Lesson (lesson_id, course_id, lesson_number, lesson_title, lesson_description) VALUES
        -- Lessons for 'Introduction to Programming'
        (UUID(), '11111111-1111-1111-1111-111111111111', 1, 'Introduction and Setup', 'Getting started with programming basics and environment setup.'),
        (UUID(), '11111111-1111-1111-1111-111111111111', 2, 'Variables and Data Types', 'Understanding variables and different data types in programming.'),
        (UUID(), '11111111-1111-1111-1111-111111111111', 3, 'Control Structures', 'Learning about control structures like loops and conditionals.'),

        -- Lessons for 'Advanced Python'
        (UUID(), '22222222-2222-2222-2222-222222222222', 1, 'Advanced Data Structures', 'Exploring advanced data structures in Python.'),
        (UUID(), '22222222-2222-2222-2222-222222222222', 2, 'Decorators and Generators', 'Understanding decorators and generators in Python.'),
        (UUID(), '22222222-2222-2222-2222-222222222222', 3, 'Concurrency and Parallelism', 'Learning about concurrency and parallelism in Python.'),

        -- Lessons for 'Data Science Fundamentals'
        (UUID(), '33333333-3333-3333-3333-333333333333', 1, 'Introduction to Data Science', 'Overview of data science and its applications.'),
        (UUID(), '33333333-3333-3333-3333-333333333333', 2, 'Data Preprocessing', 'Techniques for preprocessing data.'),
        (UUID(), '33333333-3333-3333-3333-333333333333', 3, 'Exploratory Data Analysis', 'Performing exploratory data analysis on datasets.'),

        -- Lessons for 'Machine Learning 101'
        (UUID(), '44444444-4444-4444-4444-444444444444', 1, 'Introduction to Machine Learning', 'Overview of machine learning concepts.'),
        (UUID(), '44444444-4444-4444-4444-444444444444', 2, 'Supervised Learning', 'Understanding supervised learning algorithms.'),
        (UUID(), '44444444-4444-4444-4444-444444444444', 3, 'Unsupervised Learning', 'Learning about unsupervised learning algorithms.'),

        -- Lessons for 'Web Development Basics'
        (UUID(), '55555555-5555-5555-5555-555555555555', 1, 'HTML and CSS Basics', 'Getting started with HTML and CSS.'),
        (UUID(), '55555555-5555-5555-5555-555555555555', 2, 'JavaScript Fundamentals', 'Learning the basics of JavaScript.'),
        (UUID(), '55555555-5555-5555-5555-555555555555', 3, 'Responsive Design', 'Understanding how to create responsive designs.'),

        -- Lessons for 'React for Beginners'
        (UUID(), '66666666-6666-6666-6666-666666666666', 1, 'Introduction to React', 'Overview of React and its features.'),
        (UUID(), '66666666-6666-6666-6666-666666666666', 2, 'React Components', 'Learning about components in React.'),
        (UUID(), '66666666-6666-6666-6666-666666666666', 3, 'State and Props', 'Understanding state and props in React.'),

        -- Lessons for 'Database Management'
        (UUID(), '77777777-7777-7777-7777-777777777777', 1, 'Introduction to Databases', 'Overview of database concepts.'),
        (UUID(), '77777777-7777-7777-7777-777777777777', 2, 'SQL Basics', 'Learning the basics of SQL.'),
        (UUID(), '77777777-7777-7777-7777-777777777777', 3, 'Database Design', 'Understanding how to design databases.'),

        -- Lessons for 'Cybersecurity Essentials'
        (UUID(), '99999999-9999-9999-9999-999999999999', 1, 'Introduction to Cybersecurity', 'Overview of cybersecurity principles.'),
        (UUID(), '99999999-9999-9999-9999-999999999999', 2, 'Threats and Vulnerabilities', 'Learning about common threats and vulnerabilities.'),
        (UUID(), '99999999-9999-9999-9999-999999999999', 3, 'Security Best Practices', 'Understanding best practices for cybersecurity.'),

        -- Lessons for 'Network Security'
        (UUID(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'Introduction to Network Security', 'Overview of network security concepts.'),
        (UUID(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'Network Protocols', 'Learning about different network protocols.'),
        (UUID(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'Securing Networks', 'Understanding how to secure networks.');
    END IF;
END`;

module.exports = sampleDataProcedure;
