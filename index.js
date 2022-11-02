// const inquirer = require('inquirer');
// const { department } = require('./server');
// const questions = [
//     {
//         type: 'rawlist',
//         name: 'intro',
//         message: 'What is the team manager\'s name?',
//        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', ' Update an Employee Role']
//     },
// ]

// function init() {

//     inquirer.prompt(questions).then((data) => {
//     //    const manager = new Manager(data.managerName, data.managerId, data.managerEmail, data.officeNumber)
       
//     //    myTeam.push(manager)
       
// //filter if they choose they want to add an engineer or Intern
//        if(data.intro === 'View all Departments') {
//         department()
//        }

//        else if(data.intro === 'View all Roles') {
//         internInit()
//        }
//        else if(data.intro === 'View all Employees') {
//         internInit()
//        }
//        else if(data.intro === 'Add a Department') {
//         internInit()
//        }
//        else if(data.intro === 'Add a Role') {
//         internInit()
//        }
//        else if(data.intro === 'Add an Employee') {
//         internInit()
//        }
//        else if(data.intro === 'Update an Employee Role') {
//         internInit()
//        }
//        else {
//         writeToFile(myTeam) 
//        }
       
//     });
  
// }


// //initialize 
// init();