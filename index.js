var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Gooseted1",
    database: "employeeMgmt_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would yuou like to do today?",
            choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Quit"
            ]

        })
        .then(function (answer) {
            if (answer.action === "Add department") {
                addDepartment();
            }
            else if (answer.action === "Add role") {
                addRole();
            }
            else if (answer.action === "Add employee") {
                addEmployee();
            }
            else if (answer.action === "View departments") {
                viewDepartments();
            }
            else if (answer.action === "View roles") {
                viewRoles();
            }
            else if (answer.action === "View employees") {
                viewEmployees();
            }
            else {
                connection.end();
                console.log("your session is over!");

            }
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the department?"

            },

        ])

        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    name: answer.name,
                },
                function (err) {
                    if (err) throw err;
                    console.log(`${answer.name} department was added!`);

                    start();

                }
            );
        });

}

function addRole() {

    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the name of the Role you want to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the employees salary?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "department_id",
                    type: "rawlist",
                    message: "What is the department id?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push({
                                name: results[i].name,
                                value: results[i].id
                            })
                        }
                        return choiceArray;
                    }
                },

            ])

            .then(function (answer) {
                // var newEmployee = {

                // }
                connection.query(
                    "INSERT INTO roles SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`${answer.title} role was added!`);

                        start();

                    }
                );
            });
    });

}

function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        console.log("");
        
        console.table(results);

        start();
    })
}
