-- adding initial data into departments table
-- each id will be automatically generated so we only pass name

INSERT INTO departments (name)
VALUE ("Engineering"),
      ("Finance"),
      ("Legal"),
      ("Sales");

-- adding initial data into roles table
--each id will be automatically generated so we only pass the role, salary, department_id foreign key

INSERT INTO roles (role, salary, departments_id)
VALUE ("Lead Engineer", 150000, 1),
      ("Account Manager", 160000, 2),
      ("Legal Team Lead", 250000, 3),
      ("Sales Lead", 100000, 4),
      ("Software Engineer", 120000, 1),
      ("Accountant", 125000, 2),
      ("Lawyer", 190000, 3),
      ("Salesperson", 80000, 4);


-- adding initial data into employees table
-- each id will be automatically generated so we only pass the
-- first name, last name, manager id, role id

INSERT INTO employees (first_name, last_name, managers_id, roles_id)
VALUE ("Allen", "Qin", NULL, 1),
      ("Daniel", "Hong", 1, 5),
      ("Brian", "Tsang", 1, 5),
      ("Edward", "Kim", NULL, 2),
      ("Jiyoung", "Park", 4, 6),
      ("Yubin", "Choi", NULL, 3),
      ("Jocelyn", "Kim", 6, 7),
      ("Andrew", "Lee", NULL, 4),
      ("Yuki", "Takahashi", 7, 8);
      
