const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

// Define your list of choices
const choices = [
  "View All Employees",
  "View Employees by Manager",
  "View Employees by Department",
  "Add Employee",
  "Update Employee Managers",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
  "Delete Employee",
  "Delete Role",
  "Delete Department",
  "View Total Budget by Department",
  "Quit",
];

// Prompt the user to select an item till users seleccts quit

function main()
  {
    inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: choices,
      }, 
    ])
    
    .then((answers) => {
      const input = answers.selection;
    
      if (input === 'Quit') {
        
        process.exit();
      };
    
      if (input === 'View Employees by Manager') {
        viewEmployeesByManager();
      };
    
      if (input === 'View Employees by Department') {
        viewEmployeesByDepartment();
       
      };
    
      if (input === 'View All Employees') {
        db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id;', function (err, results) {
          console.table(results);
          main();
        });

      };
    
      if (input === 'View All Roles') {
        db.query('SELECT role.id, role.title AS Title, department.department_name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
          console.table(results);
          main();
        });
        
      }; 
    
      if (input === 'View All Departments') {
        db.query('SELECT department.id, department.department_name AS Department FROM department;', function (err, results) {
          console.table(results);
          main();
        });
      
      };
    
      if (input === 'Add Department') {
        addDepartment();
   
      };
    
      if (input === 'Add Role') {
        addRole();

      };
    
      if (input === 'Add Employee') {
        addEmployee();

      };
    
      if (input === 'Update Employee Role') {
        updateEmployeeRole();

      };
    
      if (input === 'Update Employee Managers') {
        updateEmployeeManager();

      };
    
      if (input === 'Delete Employee') {
        deleteEmployee();
 
      };
    
      if (input === 'Delete Role') {
        deleteRole();
  
      };
    
      if (input === 'Delete Department') {
        deleteDepartment();
      
      };
    
      if (input === 'View Total Budget by Department') {
        combinedBudgetByDepartment();
       
      };
    
    }).catch((error) => {
      console.error(error);
    });


  }





// function to allow call that allows users to view employees based on manager
function viewEmployeesByManager(){
  const answers = [
    {
      type: 'input',
      name: 'managerName',
      message: 'What is the first name of the manager?',
    },
  ];


  inquirer.prompt(answers)
  .then((data) => {
    // console.log(data, 'line #111');  //* { managerName: 'Jack' } 
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS Manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE manager.first_name = ?;', [data.managerName], function (err, results){
      console.table(results);
      main();
    });
    console.log(`You are viewing employees under manager, ${data.managerName}`);
  })
  .catch(err => console.error(err));
};

// function to allow call that allows users to view employees based on manager
function viewEmployeesByDepartment(){
  const answers = [
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the department?',
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    // console.log(data, 'line #111');  //* { departmentName: 'Legal' } 
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS Manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE department.department_name = ?;', [data.departmentName], function (err, results){
      console.table(results);
      main();
    });
    console.log(`You are viewing employees under department, ${data.departmentName}`);
  })
  .catch(err => console.error(err));
};

function addDepartment(){
  const answers = [
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    console.log(answers);  //* { type: 'input', name: 'department', message: 'What is the name of the department?' }
    console.log(data);  //* { department: 'Industrial' }
    db.query('INSERT INTO department (department_name) VALUES (?)', [data.department], function (err, results){
        // console.table(results);
      });
      console.log(`Added ${data.department} to the departments`);
      main();
    })
  .catch(err => console.error(err));
};

// function to allow call that allows users to add role position to database
async function addRole(){
  const answers = [
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
    },
    {
      type: 'list',
      name: 'selectedDepartment',
      message: 'Which department does the role belong to?',
      choices: await getDepartmentChoices(),
    }
  ];

  inquirer.prompt(answers)
  .then((data) => {
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.selectedDepartment], function (err, results){});
    console.log(`Added ${data.title} to roles`);
    main();
  })
  .catch(err => console.error(err));
};

// function to allow call that allows users to add employees to database
async function addEmployee(){

  const answers = [
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of the employee?',
      choices: await getRoles(),
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Which manager does the employee report to?',
      choices: await getManagers(),
    }
  ];

  inquirer.prompt(answers)
  .then((data) => {
    
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first_name, data.last_name, data.role, data.manager], function (err, results){});
    console.log(`Added ${data.first_name} ${data.last_name} to database`);
    main();
    
  })
  .catch(err => console.error(err));
};


// function to allow call that allows users to update employees in database re role
async function updateEmployeeRole(){

  const answers = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee is being updated?',
      choices: await getEmployees(),
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is new role of the employee?',
      choices: await getRoles(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    console.log(data);
    db.query(`UPDATE employee SET role_id = ${data.role} WHERE id = ${data.employee};`, function (err, results){});
    console.log(`Updated employee role in the database`);
   main();
  })
  .catch(err => console.error(err));
};

// function to allow call that allows users to update employees in database re manager
async function updateEmployeeManager(){

  const answers = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee is being updated?',
      choices: await getEmployees(),
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is new manager of the employee?',
      choices: await getManagers(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {

    db.query(`UPDATE employee SET manager_id = ${data.manager} WHERE id = ${data.employee};`, function (err, results){});
    console.log(`Updated manager of employee in the database`);
    main();
  
  })
  .catch(err => console.error(err));
};

// function to allow users to delete employees in database
async function deleteEmployee(){

  const answers = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee is being removed?',
      choices: await getEmployees(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    db.query(`DELETE from employee WHERE id = ${data.employee};`, function (err, results){});
    console.log(`Deleted employee from database`);
    main();
   
  })
  .catch(err => console.error(err));
};

// function to allow users to delete roles in database
async function deleteRole(){

  const answers = [
    {
      type: 'list',
      name: 'role',
      message: 'Which role is being removed?',
      choices: await getRoles(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    db.query(`DELETE from role WHERE id = ${data.role};`, function (err, results){});
    console.log(`Deleted role from database`);
    main();
  })
  .catch(err => console.error(err));
};

// function to allow users to delete departments in database
async function deleteDepartment(){

  const answers = [
    {
      type: 'list',
      name: 'department',
      message: 'Which department is being removed?',
      choices: await getDepartmentChoices(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
  
    db.query(`DELETE from department WHERE id = ${data.department};`, function (err, results){});
    console.log(`Deleted department from database`);
    main();
  })
  .catch(err => console.error(err));
};

// function to allow users to find the combined budget by department
async function combinedBudgetByDepartment(){

  const answers = [
    {
      type: 'list',
      name: 'department',
      message: 'Which department do you want to find the combined budget?',
      choices: await getDepartmentChoices(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    console.log(data);
    db.query(`SELECT department.department_name AS Department, SUM(role.salary) AS Total_Budget FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id WHERE role.department_id = ${data.department};`, function (err, results){console.table(results);});
    console.log(`This is the combined budget of the department.`);
  })
  .catch(err => console.error(err));
};

// function that enables dynamic choice selection when trying to view employees by manager
function getManagers() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, first_name FROM employee',function(err,data){
      if(err) console.log(err)
      console.log(data);
      resolve(data.map(row => ({ value: row.value, name: row.first_name })));
    
    })
  });
}

// function that enables dynamic choice selection for list of current employees
function getEmployees() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, first_name FROM employee',function(err,data){
      if(err) console.log(err) 
      resolve(data.map(row => ({ value: row.value, name: row.first_name })));

    })
  });
}

// function that enables dynamic choice selection for list of current roles
function getRoles() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, title FROM role',function(err,data){
      if(err) console.log(err)
      console.log(data); 
      resolve(data.map(row => ({ value: row.value, name: row.title })));
     
    })
  });
}

// function that enables dynamic choice selection when adding a role position to a department
function getDepartmentChoices() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, department_name FROM department',function(err,data){
      if(err) console.log(err)
      resolve(data.map(row => ({ value: row.value, name: row.department_name })));
 
    })
   
  });

}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

main();