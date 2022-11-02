INSERT INTO department (dept_name)
VALUES ("Sales"),
       ("Marketing"),
       ("Finances"),
       ("Human Resources"),
       ("Dept 5");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 2000.00, 1 ),
       ("Engineer", 1000.00, 2),
       ("Accountant", 5000.00, 3),
       ("Intern", 6000.00, 4),
       ("Customer Service", 4000.00, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jose", "Barreto", 1),
       ("Marion", "Franco", 2),
       ("Laureano", "Barreto", 3),
       ("Romeo", "Franco", 4),
       ("Benito", "Camelo", 5);