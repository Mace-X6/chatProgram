const inquirer = require("inquirer");
const fs = require("fs");

const menu = async () => {
	const name = await inquirer.prompt({
		type: "list",
		name: "choice",
		message: "choose: ",
		choices: ["hello" , "goodbye"]
	});
	console.log(name.choice);
}

menu();
