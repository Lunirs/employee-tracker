require("dotenv").config();

//Dependencies

const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const figlet = require("figlet");

console.log(
  figlet.textSync("Employee Database!", {
    font: "Doom",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);
// Creating a connection with my database

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
          "Quit",
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

        case "Quit":
          console.log("See you next time!");
          process.exit();
      }
    });
};

// functions I needed in switch case
// function to see all employees
const viewAllEmployees = () => {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.role, departments.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.roles_id = roles.id
    LEFT JOIN departments ON roles.departments_id = departments.id
    LEFT JOIN employees manager ON employees.managers_id = manager.id `,
    (err, results) => {
      if (err) throw err;
      console.log("Viewing Employees");
      console.table(results);

      // rerun initial inquirer for users to choose another choice
      questions();
    }
  );
};

// function to see all roles
const viewAllRoles = () => {
  db.query(
    "SELECT roles.id, roles.role, departments.name AS department, roles.salary FROM roles JOIN departments ON  roles.departments_id = departments.id",
    (err, results) => {
      if (err) throw err;
      console.log("Viewing Roles");
      console.table(results);

      // rerun initial inquirer for users to choose another choice
      questions();
    }
  );
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

// function to add a new employee

// need to get response from employee query
const addEmployee = () => {
  // getting all of the data in employees table
  db.query("SELECT * FROM employees", (err, eResponse) => {
    if (err) throw err;

    // getting all of the data from the roles table
    db.query("SELECT * FROM roles", (err, rResponse) => {
      if (err) throw err;
      // inquirer prompt to add new employee
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
            // dynamically generate the choice option array utilizing response from getting all of the EMPLOYEE query
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
            // dyamically generate the choice options array utilizing the response from getting all of the ROLES query
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
          // generate a new variable that will store the object from ROLE query response to call upon later
          let roleId;
          // iterate through array of objects of ROLE query response
          for (let i = 0; i < rResponse.length; i++) {
            // if the name value of the response equals the role specified from inquirer we store that object into previously defined variable
            if (rResponse[i].role === data.role) {
              roleId = rResponse[i];
            }
          }
          //generate a new variable that will store the object from EMPLOYEE query response to call upon later
          let managerId;
          // iterate through array of objects of EMPLOYEE query response
          for (let i = 0; i < eResponse.length; i++) {
            // if the concated name is equal to the name the user chose from inquirer, store that object into the previously defined variable
            if (
              `${eResponse[i].first_name} ${eResponse[i].last_name}` ===
              data.manager
            ) {
              managerId = eResponse[i];
            }
          }

          // variables defined with values we want to insert into the query
          let firstName = data.firstName;
          let lastName = data.lastName;
          let roles_id = roleId.id;
          let managers_id = managerId.id;

          // takes the values from the variables and puts it into a query to insert a new employee
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
  // query to get all of the data from departments table
  db.query("SELECT * FROM departments", (err, response) => {
    if (err) throw err;

    // inquirer to ask about the new role.
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
          // dyamically generate the choice options array utilizing the response from getting all of the DEPARTMENTS query
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
        // generate a new variable that will store the object from DEPARTMENTS query response to call upon later
        let departmentId;
        // iterate through array of objects of DEPARTMENTS query response
        for (let i = 0; i < response.length; i++) {
          // if the name value of the response equals the department specified from inquirer we store that object into previously defined variable
          if (response[i].name === data.department) {
            departmentId = response[i];
          }
        }

        // variables defined with values we want to insert into the query
        let role = data.role;
        let salary = data.salary;
        let department_id = departmentId.id;
        // takes the values from the variables and puts it into a query to insert a new role
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
  // inquirer prompt to ask questions
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
      // answer from inquirer response
      const { department } = response;
      // add value of department from response into the query to insert a new department.
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
const updateEmployeeRole = () => {
  // getting all of the data in employees table
  db.query("SELECT * FROM employees", (err, eResponse) => {
    if (err) throw err;
    // getting all of the data from the roles table
    db.query("SELECT * FROM roles", (err, rResponse) => {
      if (err) throw err;

      // inquirer prompt to update an employee
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's role do you need to update?",
            name: "employee",
            // dynamically generate the choice option array utilizing response from getting all of the EMPLOYEE query
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
            message: "What is this employee's new role?",
            name: "role",
            choices: () => {
              // dyamically generate the choice options array utilizing the response from getting all of the ROLES query
              const options = [];
              for (let i = 0; i < rResponse.length; i++) {
                options.push(rResponse[i].role);
              }
              return options;
            },
          },
        ])
        .then((data) => {
          // generate a new variable that will store the object from ROLE query response to call upon later
          let roleId;
          // iterate through array of objects of ROLE query response
          for (let i = 0; i < rResponse.length; i++) {
            // if the name value of the response equals the role specified from inquirer we store that object into previously defined variable
            if (rResponse[i].role === data.role) {
              roleId = rResponse[i];
            }
          }
          //generate a new variable that will store the object from EMPLOYEE query response to call upon later
          let employeeId;
          // iterate through array of objects of EMPLOYEE query response
          for (let i = 0; i < eResponse.length; i++) {
            // if the concated name is equal to the name the user chose from inquirer, store that object into the previously defined variable
            if (
              `${eResponse[i].first_name} ${eResponse[i].last_name}` ===
              data.employee
            ) {
              employeeId = eResponse[i];
            }
          }
          // variables defined with values we want to insert into the query
          let roles_id = roleId.id;
          let employees_id = employeeId.id;
          // takes the values from the variables and puts it into a query to update an employee
          db.query(
            `UPDATE employees SET roles_id = ${roles_id} WHERE id = ${employees_id}`,
            (err) => {
              if (err) throw err;
              console.log("The employee was successfully updated");

              questions();
            }
          );
        });
    });
  });
};

// initialize inquirer
init();
