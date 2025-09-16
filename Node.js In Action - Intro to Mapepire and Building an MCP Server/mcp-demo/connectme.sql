-- =========================================
-- SCHEMA CREATION
-- =========================================
CREATE SCHEMA CONNECTME;
SET CURRENT SCHEMA CONNECTME;

-- =========================================
-- ACCOUNT TABLE: Customers
-- =========================================
CREATE OR REPLACE TABLE ACCOUNT (
    EMAIL_ADDRESS VARCHAR(100) NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    ACCOUNT_NUMBER INT NOT NULL,
    PRIMARY KEY(EMAIL_ADDRESS)
)
ON REPLACE DELETE ROWS;

INSERT INTO ACCOUNT (EMAIL_ADDRESS, NAME, ACCOUNT_NUMBER) VALUES
('john.doe@example.com', 'John Doe', 1111),
('jane.smith@example.com', 'Jane Smith', 2222),
('alice.jones@example.com', 'Alice Jones', 3333),
('bob.brown@example.com', 'Bob Brown', 4444),
('carol.white@example.com', 'Carol White', 5555),
('dave.green@example.com', 'Dave Green', 6666),
('emily.black@example.com', 'Emily Black', 7777),
('frank.lee@example.com', 'Frank Lee', 8888);

-- =========================================
-- PLAN TABLE: Phone Plans Offered
-- =========================================
CREATE OR REPLACE TABLE PLAN (
    PLAN_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DATA_GB INT NOT NULL,
    MINUTES INT NOT NULL,
    PRICE DECIMAL(10,2) NOT NULL
)
ON REPLACE DELETE ROWS;

INSERT INTO PLAN (NAME, DATA_GB, MINUTES, PRICE) VALUES
('Basic', 5, 100, 30.00),
('Standard', 20, 500, 60.00),
('Premium', 50, 2000, 120.00);

-- =========================================
-- PHONE TABLE: Phones Offered
-- =========================================
CREATE OR REPLACE TABLE PHONE (
    PHONE_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    MODEL VARCHAR(100) NOT NULL,
    PRICE DECIMAL(10,2) NOT NULL
)
ON REPLACE DELETE ROWS;

INSERT INTO PHONE (MODEL, PRICE) VALUES
('iPhone 14', 1200.00),
('Samsung Galaxy S23', 1000.00),
('Google Pixel 8', 900.00),
('iPhone 12', 800.00),
('Samsung Galaxy S21', 700.00);

-- =========================================
-- PLAN_PURCHASE TABLE: Customer Plan Purchases
-- =========================================
CREATE OR REPLACE TABLE PLAN_PURCHASE (
    PURCHASE_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL_ADDRESS VARCHAR(100) NOT NULL,
    PLAN_ID INT NOT NULL,
    START_DATE DATE NOT NULL,
    END_DATE DATE,
    DATA_USED_GB DECIMAL(5,2) NOT NULL,
    MINUTES_USED INT NOT NULL,
    FOREIGN KEY (EMAIL_ADDRESS) REFERENCES ACCOUNT(EMAIL_ADDRESS),
    FOREIGN KEY (PLAN_ID) REFERENCES PLAN(PLAN_ID)
)
ON REPLACE DELETE ROWS;

INSERT INTO PLAN_PURCHASE (EMAIL_ADDRESS, PLAN_ID, START_DATE, END_DATE, DATA_USED_GB, MINUTES_USED) VALUES
('john.doe@example.com', 2, '2025-01-01', NULL, 25.0, 450),
('jane.smith@example.com', 3, '2025-01-05', NULL, 60.0, 2100),
('alice.jones@example.com', 1, '2025-01-10', NULL, 6.0, 150),
('bob.brown@example.com', 1, '2025-01-03', NULL, 15.0, 200),
('carol.white@example.com', 2, '2025-01-07', NULL, 18.0, 600),
('dave.green@example.com', 1, '2025-01-08', NULL, 30.0, 400),
('emily.black@example.com', 3, '2025-01-12', NULL, 45.0, 1800),
('frank.lee@example.com', 2, '2025-01-15', NULL, 22.0, 550);

-- =========================================
-- PHONE_PURCHASE TABLE: Customer Phone Purchases
-- =========================================
CREATE OR REPLACE TABLE PHONE_PURCHASE (
    PURCHASE_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL_ADDRESS VARCHAR(100) NOT NULL,
    PHONE_ID INT NOT NULL,
    PURCHASE_DATE DATE NOT NULL,
    FOREIGN KEY (EMAIL_ADDRESS) REFERENCES ACCOUNT(EMAIL_ADDRESS),
    FOREIGN KEY (PHONE_ID) REFERENCES PHONE(PHONE_ID)
)
ON REPLACE DELETE ROWS;

INSERT INTO PHONE_PURCHASE (EMAIL_ADDRESS, PHONE_ID, PURCHASE_DATE) VALUES
('john.doe@example.com', 1, '2025-01-02'),
('jane.smith@example.com', 2, '2025-01-06'),
('alice.jones@example.com', 3, '2025-01-11'),
('bob.brown@example.com', 4, '2025-01-04'),
('carol.white@example.com', 5, '2025-01-08'),
('dave.green@example.com', 4, '2025-01-09'),
('emily.black@example.com', 2, '2025-01-13');