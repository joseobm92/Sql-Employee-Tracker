const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
let allDpts = [];
let allRoles = [];
let allEmployees = [];
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
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'rootroot',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

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

const departmentQuestion = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'Enter department name: '

    }
];

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

const updateEmployeeQuestions =[
    {
        type: 'list',
        name: 'employee',
        message: 'Select the employee you want to update:',
        choices: allEmployees

    },

    {
        type: 'list',
        name: 'roles',
        message: 'Whats the new role of the employee',
        choices: allRoles
    }
];

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

function viewEmployees() {
    const sql = 'SELECT * FROM employee'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            for (let i = 0; i < results.length; i++) {
                allEmployees.push(results[i].first_name + " " + results[i].last_name);
            } console.log(allEmployees)
        }
    });
}



// Query database
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

    // init();
}


function viewAllEmployees() {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id, department.dept_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON employee.role_id = department.id;'
    db.query(sql, function (err, results) {
        console.table(results);
    });

    // init();
}


function addDepartment() {
    inquirer.prompt(departmentQuestion).then((data) => {
        const newDepartment = data.dept_name;
        const sql = `INSERT INTO department (dept_name) VALUES (?)`
        db.query(sql, newDepartment, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
    });

    // init();
};

function addRole() {
    //get list of current departments
    viewAllDepartmentsByName();
    // set depID index = 1
    let depID = 0;
    inquirer.prompt(roleQuestions).then((answers) => {
        //log results from input
        console.log(answers.title);
        let salary = parseInt(answers.salary);
        console.log(salary);
        console.log(answers.department);
        console.log(allDpts);

        //get department id by looping through list of dep
        for (let i = 0; i < allDpts.length; i++) {
            // if the answer matches any of the departments in list
            // dep id = index + 1 of department in list
            if (allDpts[i] === answers.department) {
                console.log(allDpts[i]);
                console.log(answers.department);
                depID = i + 1;
                console.log(depID);
            }
        }

        const sql = `INSERT INTO role SET ?`
        const params = {
            title: answers.title,
            salary: salary,
            department_id: depID
        };
        console.log(params);
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                init();
            }
            else {
                console.table(result);
                // reset department list to empty array 
                allDpts = []
                // call main menu
                init();
            }
        });
    });
};

function addEmployee() {

    viewRoles();
    let rolesId = 0
    inquirer.prompt(employeeQuestions).then((answers) => {
        //log results from input
        console.log(answers.firstName);
        console.log(answers.lastName);
        console.log(answers.roles);
        console.log(allRoles);

        for (let i = 0; i < allRoles.length; i++) {
            // if the answer matches any of the departments in list
            // dep id = index + 1 of department in list
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
                console.table(result);
                // reset department list to empty array 
                allRoles = []
                // call main menu
                init();
            }
        });
    });

}

function updateEmployee(){

    viewEmployees();

    
    

}


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





function init() {

    inquirer.prompt(introQuestion).then((data) => {
        //    const manager = new Manager(data.managerName, data.managerId, data.managerEmail, data.officeNumber)
        //    myTeam.push(manager)

        //filter if they choose they want to add an engineer or Intern
        if (data.intro === 'View all Departments') {
            viewAllDepartments()
        }

        else if (data.intro === 'View all Roles') {
            viewAllRoles();
        }
        else if (data.intro === 'View all Employees') {
            viewAllEmployees()
        }
        else if (data.intro === 'Add a Department') {
            addDepartment()
        }
        else if (data.intro === 'Add a Role') {
            addRole()
        }
        else if (data.intro === 'Add an Employee') {
           addEmployee()
        }
        else if (data.intro === 'Update an Employee Role') {
            updateEmployee()
        }
        
    });

}


//initialize 
init();