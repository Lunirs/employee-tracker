-- Create company database

DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

-- Create Tables

-- Department

CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Role
-- Need department ID as department to roles is 1 to many

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(30) NOT NULL,
    salary FLOAT NOT NULL,
    departments_id INT NOT NULL,
    FOREIGN KEY (departments_id)
    REFERENCES departments(id)
    ON DELETE CASCADE
);


-- employee 
-- need roles id as role to employee is one to many
-- also need manager id as manager to employee can be one to many

CREATE TABLE employees(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    managers_id INT,
    roles_id INT NOT NULL, 
    FOREIGN KEY (roles_id)
    REFERENCES roles(id)
    ON DELETE CASCADE,
    FOREIGN KEY (managers_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
);