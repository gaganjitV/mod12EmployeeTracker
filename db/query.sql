-- joining the data to create related tables

SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS manager
FROM role
JOIN department ON role.department_id = department.id
JOIN employee ON employee.role_id = role.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;
