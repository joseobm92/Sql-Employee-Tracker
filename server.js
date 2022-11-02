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
        message: 'What is the team manager\'s name?',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', ' Update an Employee Role']
    },
]

const departmentQuestion = [
    {
        type: 'input',
        name: 'dept',
        message: 'Enter department name: '
      
    }
]
// Query database
function viewAllDepartments() {
    db.query('SELECT id, dept_name FROM department', function (err, results) {
        console.table(results);
    });

    init();
}
function viewAllRoles() {
db.query('SELECT id, title, salary, department_id  FROM role', function (err, results) {
    console.table(results);
});
}
function viewAllEmployees() {
db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
});
}
function addDepartment() {
    inquirer.prompt(departmentQuestion).then((data) => {
        const newDepartment = data.dept;
    });

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
            viewAllRoles()
        }
        else if (data.intro === 'View all Employees') {
            viewAllEmployees()
        }
        else if (data.intro === 'Add a Department') {
            addDepartment()
        }
        else if (data.intro === 'Add a Role') {
            internInit()
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


//initialize 
init();