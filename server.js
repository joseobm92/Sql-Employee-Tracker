const express = require('express');
const inquirer = require('inquirer');
let allDpts = [];
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
        type: 'rawlist',
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
]

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

function viewAllDepartmentsByName() {
    const sql = 'SELECT * FROM department'
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            for (let i = 0; i < results.length; i ++) {
                allDpts.push(results[i].dept_name)
            }
        }
    });


};
 


// Query database
function viewAllDepartments() {
    const sql = 'SELECT * FROM department'
    db.query(sql, function (err, results) {
        console.table(results);
    });

    // init();
}


function viewAllRoles() {
    const sql = 'SELECT role.id, role.title, role.salary, role.department_id, department.dept_name FROM role JOIN department ON role.department_id = department.id;'
    db.query(sql, function (err, results) {
        console.table(results);
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
    inquirer.prompt(roleQuestions).then((data) => {
        const newRole = data.title;
        const newSalary = parseInt(data.salary);
        const dptId = data.department;
        console.log(newRole, newSalary, dptId)
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [newRole, newSalary, dptId], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
    });

    // init();
};


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
            viewAllRoles()
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
            internInit()
        }
        else if (data.intro === 'Update an Employee Role') {
            internInit()
        }
        //    else {
        //     writeToFile(myTeam) 
        //    }

    });

}

viewAllDepartmentsByName();
//initialize 
init();