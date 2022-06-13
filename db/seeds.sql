INSERT INTO departments (name)
VALUE ("Engineering"),
      ("Finance"),
      ("Legal"),
      ("Sales");


INSERT INTO roles (role, salary, departments_id)
VALUE ("Lead Engineer", 150000, 1),
      ("Account Manager", 160000, 2),
      ("Legal Team Lead", 250000, 3),
      ("Sales Lead", 100000, 4),
      ("Software Engineer", 120000, 1),
      ("Accountant", 125000, 2),
      ("Lawyer", 190000, 3),
      ("Salesperson", 80000, 4);
