-- Create Schema
CREATE SCHEMA CONNECTME;

-- Set Schema
SET CURRENT SCHEMA CONNECTME;

-- Create Table
CREATE OR REPLACE TABLE ACCOUNT (
    EMAIL_ADDRESS VARCHAR(100) NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    ACCOUNT_NUMBER CHAR(4) NOT NULL,
    PRIMARY KEY(EMAIL_ADDRESS)
)
ON REPLACE DELETE ROWS;


-- Insert Data
INSERT INTO ACCOUNT (EMAIL_ADDRESS, NAME, ACCOUNT_NUMBER) VALUES
('john.doe@example.com', 'John Doe', 'A123'),
('jane.smith@example.com', 'Jane Smith', 'B456'),
('alice.jones@example.com', 'Alice Jones', 'C789'),
('bob.brown@example.com', 'Bob Brown', 'D012');

-- Query Table
SELECT * FROM CONNECTME.ACCOUNT;