const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Empty arrays to receive all departments, all roles, and all employees to use in Questions, and add role and add employee functions
let allDpts = [];
let allRoles = [];
let allEmployees = [];

// Import and require mysql2
const mysql = require('mysql2');

//assigning port 
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'rootroot',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

// introductory question with choices
const introQuestion = [
    {
        type: 'list',
        name: 'intro',
        message: 'What would you like to do:',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'
        ]
    },
];

//variable with department question to be used when adding a new department
const departmentQuestion = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'Enter department name: '

    }
];

//variable with role questions to be used when adding a new role
const roleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'Whats the name of the role? '

    },

    {
        type: 'input',
        name: 'salary',
        message: 'Whats the Salary of the role?'

    },

    {
        type: 'list',
        name: 'department',
        message: 'What department does the role belong to?',
        choices: allDpts

    }
];

//variable with employee questions to be used when add new employee
const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: 'Whats is the employee first name?'

    },

    {
        type: 'input',
        name: 'lastName',
        message: 'Whats is the employee last name?'

    },

    {
        type: 'list',
        name: 'roles',
        message: 'What is the employees role?',
        choices: allRoles

    }
];

//varible with update employee questions
const updateEmployeeQuestions = [
    {
        type: 'list',
        name: 'employee',
        message: 'Select the employee you want to update:',
        choices: viewEmployees()

    },

    {
        type: 'list',
        name: 'roles',
        message: 'Whats the new role of the employee',
        choices: allRoles
    }

];

//function to get all departments and use it to add new role
function viewAllDepartmentsByName() {
    const sql = 'SELECT * FROM department'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            for (let i = 0; i < results.length; i++) {
                allDpts.push(results[i].dept_name);
            }
        }
    });
};

//function to get all roles and use it to create new employee
function viewRoles() {
    const sql = 'SELECT * FROM role'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            for (let i = 0; i < results.length; i++) {
                allRoles.push(results[i].title);
            }
        }
    });
};
//function to get all employees to use on update employee function
function viewEmployees() {
    const sql = 'SELECT * FROM employee'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            for (let i = 0; i < results.length; i++) {
                allEmployees.push(results[i].first_name + " " + results[i].last_name);
            }
        }
    });
    return allEmployees;
};


// function to view all Departments
function viewAllDepartments() {
    const sql = 'SELECT * FROM department'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            init()
        } else {
            console.table(results);
            init()
        }
    });

    // init();
}

// function to view all roles
function viewAllRoles() {

    const sql = 'SELECT role.id, role.title, role.salary, role.department_id, department.dept_name FROM role JOIN department ON role.department_id = department.id;'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            init()
        } else {
            console.table(results);
            init()
        }
    });

}

//function to view all Employees
function viewAllEmployees() {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id, department.dept_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON employee.role_id = department.id;'
    db.query(sql, function (err, results) {
         if (err) {
            console.log(err.message);
            init()
        } else {
            console.table(results);
            init()
        }
    });

}

// function to add a new department
function addDepartment() {
    inquirer.prompt(departmentQuestion).then((answers) => {
        const newDepartment = answers.dept_name;
        const sql = `INSERT INTO department (dept_name) VALUES (?)`
        db.query(sql, newDepartment, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(`${answers.dept_name} has been added as a new department`);
        });
    });

  
};

//function to add a new role
function addRole() {
    //get list of current departments
    viewAllDepartmentsByName();
    
    let depID = 0;
    inquirer.prompt(roleQuestions).then((answers) => {
        
       
        let salary = parseInt(answers.salary);
        

        //get department id by looping through list of dep
        for (let i = 0; i < allDpts.length; i++) {
            
            if (allDpts[i] === answers.department) {
               
                depID = i + 1;
                
            }
        }

        const sql = `INSERT INTO role SET ?`
        const params = {
            title: answers.title,
            salary: salary,
            department_id: depID
        };

        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                init();
            }
            else {
                console.log(`${answers.title} has been succesfully added as a new Role`);
                // reset all departments to empty
                allDpts = []
                // call init
                init();
            }
        });
    });
};

//function to add a new employee
function addEmployee() {
//get all roles to be used on questions
    viewRoles();

    let rolesId = 0
    inquirer.prompt(employeeQuestions).then((answers) => {
        //log results from input
        console.log(answers.firstName);
        console.log(answers.lastName);
        console.log(answers.roles);
        console.log(allRoles);

        for (let i = 0; i < allRoles.length; i++) {
            
            if (allRoles[i] === answers.roles) {
                console.log(allRoles[i]);
                console.log(answers.roles);
                rolesId = i + 1;
                console.log(rolesId);
            }
        }


        const sql = `INSERT INTO employee SET ?`
        const params = {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: rolesId
        };
        console.log(params);
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                init();
            }
            else {
                console.log(`${answers.firstName} ${answers.lastName} has been added as an Employee`);
                // reset role list to empty array
                allRoles = []
                // call init function
                init();
            }
        });
    });

}

//function to update an Employee role
function updateEmployee() {
    let roleId = 0;
    let employeeId = 0;

    viewRoles();
    
    inquirer.prompt(updateEmployeeQuestions).then((answers) => {


        for(let i = 0; i < allRoles.length; i ++) {
            // if the answer matches any of the roles in list
                // role id = index + 1 of role in list
             if(allRoles[i] === answers.roles) {
                roleId = i + 1;
                
             }
        }

        // get employee id by looping through the list of employees
        for(let i = 0; i < allEmployees.length; i ++) {
            // if the answer matches any of the roles in list
                // role id = index + 1 of role in list
             if(allEmployees[i] === answers.employee) {
                
                employeeId = i + 1;
             }
        }

        db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`,  function (err, result) {
            if (err) {
                console.log(err.message);
                init();
            }
            else {
                console.log(`${answers.employee} role updated to ${answers.roles}`);
                //printTable(result);
                // reset department list to empty array 
                allRoles = []
                // call main menu
                init();
            }        
        });





        
        
    });
}


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
// set to listen to PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




// initial function 
function init() {

    inquirer.prompt(introQuestion).then((answers) => {
        //    const manager = new Manager(data.managerName, data.managerId, data.managerEmail, data.officeNumber)
        //    myTeam.push(manager)

        //filter if they choose they want to add an engineer or Intern
        if (answers.intro === 'View all Departments') {
            viewAllDepartments()
        }

        else if (answers.intro === 'View all Roles') {
            viewAllRoles();
        }
        else if (answers.intro === 'View all Employees') {
            viewAllEmployees()
        }
        else if (answers.intro === 'Add a Department') {
            addDepartment()
        }
        else if (answers.intro === 'Add a Role') {
            addRole()
        }
        else if (answers.intro === 'Add an Employee') {
           addEmployee()
        }
        else if (answers.intro === 'Update an Employee Role') {
            updateEmployee()
        }
        
    });

}


//initialize 
init();

