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

        // Need function to see all roles
        // Need function to see all departments
        // Need function to add new role
        // Need function to add new department
        // Need function to update employee role
      }
    });
};

init();
