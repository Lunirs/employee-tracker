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
          "Add a new employee",
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

        case "Add a new employee":
          // Need function to add new employee
          addEmployee();
          break;

        case "Add a new role":
          // Need function to add new role
          addRole();
          break;

        case "Add a new department":
          // Need function to add new department
          addDepartment();
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
    console.log(results);
    console.table(results);

    // rerun initial inquirer for users to choose another choice
    questions();
  });
};

// function to add a new employee

// need to get response from employee query
const addEmployee = () => {
  db.query("SELECT * FROM employees", (err, eResponse) => {
    if (err) throw err;

    db.query("SELECT * FROM roles", (err, rResponse) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the new employee's first name?",
            name: "firstName",
            validate: (response) => {
              if (response) {
                return true;
              } else {
                console.log("You cannot leave this portion blank.");
              }
            },
          },
          {
            type: "input",
            message: "What is the new employee's last name?",
            name: "lastName",
            validate: (response) => {
              if (response) {
                return true;
              } else {
                console.log("You cannot leave this portion blank.");
              }
            },
          },
          {
            type: "list",
            message: "Who is the new employee's manager?",
            name: "manager",
            choices: () => {
              const options = [];
              for (let i = 0; i < eResponse.length; i++) {
                options.push(
                  `${eResponse[i].first_name} ${eResponse[i].last_name}`
                );
              }
              return options;
            },
          },
          {
            type: "list",
            message: "What is the new employee's role?",
            name: "role",
            choices: () => {
              const options = [];
              for (let i = 0; i < rResponse.length; i++) {
                options.push(rResponse[i].role);
              }
              return options;
            },
          },
        ])
        .then((data) => {
          let roleId;
          for (let i = 0; i < rResponse.length; i++) {
            if (rResponse[i].role === data.role) {
              roleId = rResponse[i];
            }
          }

          let managerId;
          for (let i = 0; i < eResponse.length; i++) {
            if (
              `${eResponse[i].first_name} ${eResponse[i].last_name}` ===
              data.manager
            ) {
              managerId = eResponse[i];
            }
          }

          let firstName = data.firstName;
          let lastName = data.lastName;
          let roles_id = roleId.id;
          let managers_id = managerId.id;

          db.query(
            `INSERT INTO employees(first_name, last_name, managers_id, roles_id) VALUES ("${firstName}", "${lastName}", ${managers_id}, ${roles_id})`,
            (err) => {
              if (err) throw err;
              console.log(
                "The new employee has been successfully added to the database"
              );
              questions();
            }
          );
        });
    });
  });
};

// function to add a new role
const addRole = () => {
  db.query("SELECT * FROM departments", (err, response) => {
    if (err) throw err;
    console.log(response);
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please specify the role are you adding.",
          name: "role",
          validate: (response) => {
            if (response) {
              return true;
            } else {
              console.log("You cannot leave this portion blank.");
            }
          },
        },
        {
          type: "input",
          message: "Please specify the salary for this new role.",
          name: "salary",
          validate: (response) => {
            if (response) {
              return true;
            } else {
              console.log("You cannot leave this portion blank.");
            }
          },
        },
        {
          type: "list",
          message: "Please specify the department this new role belongs to.",
          choices: () => {
            const options = [];
            for (let i = 0; i < response.length; i++) {
              options.push(response[i].name);
            }
            return options;
          },
          name: "department",
        },
      ])
      .then((data) => {
        let departmentId;
        for (let i = 0; i < response.length; i++) {
          if (response[i].name === data.department) {
            departmentId = response[i];
          }
        }

        let role = data.role;
        let salary = data.salary;
        let department_id = departmentId.id;
        db.query(
          `INSERT INTO roles (role, salary, departments_id) VALUES ("${role}", ${salary}, ${department_id});`,
          (err) => {
            if (err) throw err;
            console.log("The new role has been successfully added");
            questions();
          }
        );
      });
  });
};

// function to add a new department
const addDepartment = () => {
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
