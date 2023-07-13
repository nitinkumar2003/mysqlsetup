const spQueryArray = [
  `
    CREATE PROCEDURE IF NOT EXISTS sp_getGenders()
    BEGIN
      SELECT * FROM tblGender;
    END
  `,
  `
    CREATE PROCEDURE IF NOT EXISTS sp_tblCountries()
    BEGIN
      SELECT * FROM tblCountries;
    END
  `,
  `
    CREATE PROCEDURE IF NOT EXISTS sp_InsertRegisterUser(
      IN i_userName VARCHAR(255),
      IN i_userEmail VARCHAR(255),
      IN i_userPassword VARCHAR(255),
      IN i_userId VARCHAR(255),
      IN i_genderId INT,
      IN i_countryId INT,
      IN i_statusId INT
    ) 
    BEGIN
      INSERT INTO tblRegisterUser(userName, userEmail, userPassword, userId, genderId, countryId, statusId) 
      VALUES (i_userName, i_userEmail, i_userPassword, i_userId, i_genderId, i_countryId, i_statusId);
      
      SELECT * FROM tblRegisterUser WHERE userEmail = i_userEmail;
    END
  `,
  `
    CREATE PROCEDURE IF NOT EXISTS sp_InsertOtp(
      IN userId VARCHAR(255),
      IN otp INT
    )
    BEGIN 
      INSERT INTO tblOtp(userId, otp) VALUES (userId, otp);
    END
  `,
  `
    CREATE PROCEDURE IF NOT EXISTS sp_VerifyOtp(
      IN userId VARCHAR(255),
      IN providedOtp INT,
      IN updateStatus BOOLEAN,
      OUT message VARCHAR(255)
    )
    BEGIN
      DECLARE expiresAt TIMESTAMP;

      SELECT otp, expiresAt INTO @otp, expiresAt
      FROM tblOtp
      WHERE userId = userId
      ORDER BY createdOn DESC
      LIMIT 1;

      IF @otp IS NULL THEN
        SET message = 'No OTP found for the user';
      ELSEIF expiresAt <= NOW() THEN
        SET message = 'OTP has expired';
      ELSEIF @otp <> providedOtp THEN
        SET message = 'OTP does not match';
      ELSE 
        IF updateStatus THEN 
          UPDATE tblRegisterUser SET isActive = 1 WHERE userId = userId;
          IF ROW_COUNT() > 0 THEN 
            SET message = 'OTP verification successful and user activated';
          ELSE
            SET message = 'Failed to update user status';
          END IF;
        ELSE
          SET message = 'OTP verification successful';
        END IF;
      END IF;
    END
  `,
 `CREATE PROCEDURE IF NOT EXISTS sp_Login(
  IN in_userEmail VARCHAR(255),
  IN in_userPassword VARCHAR(255),
  OUT out_userId INT
)
BEGIN
  DECLARE user_id INT;

  SELECT id INTO user_id FROM tblRegisterUser WHERE userEmail = in_userEmail AND userPassword = in_userPassword;
  
  IF user_id IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password';
  ELSE
    SET out_userId = user_id; -- Assign user_id to the out_userId output parameter
  END IF;
END
`,`CREATE PROCEDURE IF NOT EXISTS sp_GetUser(IN in_userId VARCHAR(255))
BEGIN
SELECT R.userName,R.userEmail,R.isActive,R.userId,G.gender,C.country,S.status
FROM tblRegisterUser AS R 
LEFT JOIN
tblGender AS G ON R.genderId=G.genderId
LEFT JOIN
tblCountries AS C ON R.countryId=C.countryId
LEFT JOIN
tblStatus AS S ON R.statusId=S.statusId
WHERE R.userId=in_userId;
END`
];

module.exports = spQueryArray;
