-- query created to show when viewAllRoles function is used
SELECT role.id, role.title, role.salary, role.department_id, department.dept_name
FROM role
JOIN department ON role.department_id = department.id;

-- query created to show when viewAllEmployees function is used
SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id, department.dept_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

UPDATE employee
SET 
