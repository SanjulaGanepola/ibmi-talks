-- Create Schema
CREATE SCHEMA CONNECTME;

-- Set Schema
SET CURRENT SCHEMA CONNECTME;

-- Create Table
CREATE OR REPLACE TABLE ACCOUNT (
    EMAIL_ADDRESS VARCHAR(100) NOT NULL NOT HIDDEN PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL NOT HIDDEN,
    ACCESS_CODE CHAR(4) NOT NULL NOT HIDDEN
)
ON REPLACE DELETE ROWS;

-- Insert Sample Data
INSERT INTO ACCOUNT (EMAIL_ADDRESS, NAME, ACCESS_CODE) VALUES
('john.doe@example.com', 'John Doe', 'A123'),
('jane.smith@example.com', 'Jane Smith', 'B456'),
('alice.jones@example.com', 'Alice Jones', 'C789'),
('bob.brown@example.com', 'Bob Brown', 'D012');

-- Query Table
SELECT * FROM CONNECTME.ACCOUNT;