// linked files 
const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const style = require("./assets/css/style");

//empty arry for employees to be stored
const employees = [];

//main function to run once the app is started
function initApp() {
    startHtml();
    addMember();
}

// get user input to display on cards/ add members to cards
function addMember() {
    inquirer.prompt([{
        message: "Enter team member's name",
        name: "name"
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {
        message: "Enter team member's id",
        name: "id"
    },
    {
        message: "Enter team member's email address",
        name: "email"
    }]) // changing certain attribute names to fit there role for better information
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username";
        } else if (role === "Intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }]) //adding new members to list if yes is choosen
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            } else {
                newMember = new Manager(name, id, email, roleInfo);
            } //push new member to employees
            employees.push(newMember);
            //add the new member to the html
            addHtml(newMember)
            //check to see if clients want to add more members, if yes then add members function is repeated 
            .then(function() {
                if (moreMembers === "yes") {
                    addMember();
                } else {
                    finishHtml();
                }
            });
            
        });
    });
}

// function renderHtml(memberArray) {
//     startHtml();
//     for (const member of memberArray) {
//         addHtml(member);
//     }
//     finishHtml();
// }

// first function ran after init. this will generated code then write it on a html card in dist
function startHtml() {
    const html =
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <title>Team Profile</title>
        <style> ${style} </style>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-dark mb-5">
            <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
        </nav>
        <div class="container">
            <div class="row">`;
    fs.writeFile("./dist/team.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}
// adding input to html generated on line 94
function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = 
            
            `<div class="col-6">
                <div class="card mx-auto mb-6">
                    <div class="card-header">
                        <h5> ${name}</h5>
                        <div class="row positionC"> 
                            <h5 class="black">Position:</h5><h5>${role}</h5>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${id}</li>
                        <li class="list-group-item">Email Address: ${email}</li>
                        <li class="list-group-item">GitHub: ${gitHub}</li>
                    </ul>
                </div>
            </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = 
            `<div class="col-6">
                <div class="card mx-auto mb-6">
                    <div class="card-header">
                        <h5> ${name}</h5>
                        <div class="row positionC"> 
                            <h5 class="black">Position:</h5><h5>${role}</h5>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${id}</li>
                        <li class="list-group-item">Email Address: ${email}</li>
                        <li class="list-group-item">School: ${school}</li>
                    </ul>
                </div>
            </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data =
            `<div class="col-6">
                <div class="card mx-auto mb-6">
                    <div class="card-header">
                        <h5> ${name}</h5>
                        <div class="row positionC"> 
                            <h5 class="black">Position:</h5><h5>${role}</h5>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${id}</li>
                        <li class="list-group-item">Email Address: ${email}</li>
                        <li class="list-group-item">Office Phone: ${officePhone}</li>
                    </ul>
                </div>
            </div>`
        }
        console.log("adding team member");
        fs.appendFile("./dist/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
    
            
    
        
    
    
}

function finishHtml() {
    //adding divs to the end of html once all cards have been added
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./dist/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("Congrats! Your team profile has been generated, collect html in dist directory");
}

// addMember();
// startHtml();
// addHtml("hi")
// .then(function() {
// finishHtml();
// });

//start he app
initApp();