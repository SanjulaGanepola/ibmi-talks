-- Create Schema
CREATE SCHEMA CONNECTME;

-- Set Schema
SET CURRENT SCHEMA CONNECTME;

-- Create Table
CREATE OR REPLACE TABLE ACCOUNT (
    EMAIL_ADDRESS VARCHAR(100) NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    ACCOUNT_NUMBER INT NOT NULL,
    PRIMARY KEY(EMAIL_ADDRESS)
)
ON REPLACE DELETE ROWS;

-- Insert Data
INSERT INTO ACCOUNT (EMAIL_ADDRESS, NAME, ACCOUNT_NUMBER) VALUES
('john.doe@example.com', 'John Doe', '1111'),
('jane.smith@example.com', 'Jane Smith', '2222'),
('alice.jones@example.com', 'Alice Jones', '3333'),
('bob.brown@example.com', 'Bob Brown', '4444');

-- Query Table
SELECT * FROM CONNECTME.ACCOUNT;