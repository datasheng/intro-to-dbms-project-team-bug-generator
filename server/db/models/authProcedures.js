const authProcedures = [
  {
    name: "RegisterUser",
    query: `
    CREATE PROCEDURE IF NOT EXISTS RegisterUser(
        IN p_full_name VARCHAR(255),
        IN p_email VARCHAR(255),
        IN p_password VARCHAR(255),
        OUT p_success BOOLEAN,
        OUT p_message VARCHAR(255)
    )
    BEGIN
        DECLARE user_count INT;
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            SET p_success = FALSE;
            SET p_message = 'Internal Server Error';
            ROLLBACK;
        END;

        START TRANSACTION;

        -- Check if email already exists
        SELECT COUNT(*) INTO user_count FROM User WHERE email = p_email;
        
        IF user_count > 0 THEN
            SET p_success = FALSE;
            SET p_message = 'Email already in use';
        ELSE
            -- Insert new user
            INSERT INTO User (user_id, full_name, email, password)
            VALUES (UUID(), p_full_name, p_email, p_password);
            
            SET p_success = TRUE;
            SET p_message = 'Registration successful';
        END IF;

        COMMIT;
    END
    `,
  },
  {
    name: "LoginUser",
    query: `
    CREATE PROCEDURE IF NOT EXISTS LoginUser(
        IN p_email VARCHAR(255),
        OUT p_user_id VARCHAR(36),
        OUT p_full_name VARCHAR(255),
        OUT p_hashed_password VARCHAR(255),
        OUT p_success BOOLEAN,
        OUT p_message VARCHAR(255)
    )
    BEGIN
        DECLARE user_count INT;
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            SET p_success = FALSE;
            SET p_message = 'Internal Server Error';
        END;

        -- Check if user exists
        SELECT COUNT(*) INTO user_count FROM User WHERE email = p_email;
        
        IF user_count = 0 THEN
            SET p_success = FALSE;
            SET p_message = 'User not found';
        ELSE
            -- Retrieve user information
            SELECT user_id, full_name, password
            INTO p_user_id, p_full_name, p_hashed_password
            FROM User
            WHERE email = p_email;
            
            SET p_success = TRUE;
            SET p_message = 'User found';
        END IF;
    END
    `,
  },
];

module.exports = authProcedures;
