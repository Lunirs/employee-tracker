require("dotenv").config();

//Dependencies

const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Creating a connection with my database

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  console.log("Database successfully connected")
);

// initialization function that will run at load and start up initial inquirer
const init = () => questions();

// initial inquirer  prompting them on the things they can do with app.
const questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select what you would like to do.",
        choices: [
          "View all employees",
          "View all roles",
          "View all departments",
          "Add an employee",
          "Add a new role",
          "Add a new department",
          "Update employee role",
        ],
        name: "userChoice",
      },
    ])
    .then((response) => {
      // switch case depending on the choice they made
      switch (response.userChoice) {
        // add cases and for each case have it run a appropriate function that runs
        // probably will need to add more depending on if i can do bonus
        case "View all employees":
          // Need function to see all employees
          viewAllEmployees();
          break;

        case "View all roles":
          // Need function to see all roles
          viewAllRoles();
          break;

        case "View all departments":
          // Need function to see all departments
          viewAllDepartments();
          break;

        case "Add a new role":
          // Need function to add new role
          addNewRole();
          break;

        case "Add a new department":
          // Need function to add new department
          addNewDepartment();
          break;

        case "Update employee role":
          // Need function to update employee role
          updateEmployeeRole();
          break;
      }
    });
};

// functions I needed in switch case

// function to see all employees
const viewAllEmployees = () => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) throw err;
    console.log("Viewing Employees");
    console.table(results);

    // rerun initial inquirer for users to choose another choice
    questions();
  });
};

// function to see all roles
const viewAllRoles = () => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    console.log("Viewing Roles");
    console.table(results);

    // rerun initial inquirer for users to choose another choice
    questions();
  });
};

// function to see all departments
const viewAllDepartments = () => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    console.log("Viewing Departments");
    console.table(results);

    // rerun initial inquirer for users to choose another choice
    questions();
  });
};

// function to add a new role
const addNewRole = () => {};

// function to add a new department
const addNewDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please specify the new department's name.",
        validate: (department) => {
          if (department) {
            return true;
          } else {
            console.log("You cannot leave this portion blank.");
          }
        },
        name: "department",
      },
    ])
    .then((response) => {
      const { department } = response;
      db.query(
        `INSERT INTO departments(name) VALUES ("${department}")`,
        (err) => {
          if (err) throw err;
          console.log(
            `${department} has successfully been added as a new department.`
          );
          questions();
        }
      );
    });
};

// function to update employee role
const updateEmployeeRole = () => {};

init();
