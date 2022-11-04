    INSERT INTO department (dept_name)
    VALUES ("Sales"),
        ("Marketing"),
        ("Finances"),
        ("Human Resources"),
        ("Customer Service");

    INSERT INTO role (title, salary, department_id)
    VALUES ("Account Executive", 2000.00, 1 ),
        ("Digital Marketing", 1000.00, 2),
        ("Data Analyst", 5000.00, 3),
        ("Admission Specialist", 6000.00, 4),
        ("Customer Success Associate", 4000.00, 5);

    INSERT INTO employee (first_name, last_name, role_id)
    VALUES ("Jose", "Barreto", 1),
        ("Marion", "Franco", 2),
        ("Laureano", "Barreto", 3),
        ("Romeo", "Franco", 4),
        ("Benito", "Camelo", 5);