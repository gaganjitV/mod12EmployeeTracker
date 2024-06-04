INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 10000000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Acountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("gagan", "singh", 1, null),
       ("singh", "singh", 2, 1),
       ("tim", "vic", 3, 1),
       ("ayla", "victor", 4, 2),
       ("emily", "victor", 5, 2),
       ("subeg", "Beber", 6, 1),
       ("nic", "Sam", 7, 2);