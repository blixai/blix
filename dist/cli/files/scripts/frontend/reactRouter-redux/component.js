"use strict";
var fs = require("fs");
var path = require("path");
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// assign name from user command line input and capitalize the first letter (per React Component Naming Conventions)
var name = process.argv[2] || "";
var capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);
// helper to load files from relative path to this file, returns file data
var loadFile = function (filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};
var statelessComponent = loadFile("./templates/statelessComponent.js");
statelessComponent = statelessComponent.replace(/Name/g, "" + name);
var statefulComponent = loadFile("./templates/statefulComponent.js");
statefulComponent = statefulComponent.replace(/Name/g, "" + name);
var container = loadFile("./templates/container.js");
container = container.replace(/Name/g, "" + name);
// asks if component is stateful or stateless and passes that to the createFiles function
var askState = function () {
    rl.question("? Stateful component: (Y/n) ", function (answer) {
        answer = answer.toLowerCase();
        if (answer === "y") {
            createFiles();
        }
        else if (answer === "n") {
            createFiles("stateless");
        }
        else {
            console.log("Invalid answer. Please try again!");
            askState();
        }
    });
};
var createFiles = function (type) {
    fs.mkdirSync("./src/components/" + name);
    if (type === "stateless") {
        fs.writeFile("./src/components/" + name + "/" + name + ".js", statelessComponent, function (err) {
            if (err)
                return console.log(err);
            console.log("The Component " + name + " was created!");
        });
        fs.writeFile("./src/components/" + name + "/" + name + "Container.js", container, function (err) {
            if (err)
                return console.log(err);
            console.log("The Container " + name + " was created!");
        });
        fs.writeFile("./src/components/" + name + "/" + name + ".css", "", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("CSS file was created!");
        });
    }
    else {
        fs.writeFile("./src/components/" + name + "/" + name + ".js", statefulComponent, function (err) {
            if (err)
                return console.log(err);
            console.log("The Component " + name + " was created!");
        });
        fs.writeFile("./src/components/" + name + "/" + name + "Container.js", container, function (err) {
            if (err)
                return console.log(err);
            console.log("The Container " + name + " was created!");
        });
        fs.writeFile("./src/components/" + name + "/" + name + ".css", "", function (err) {
            if (err)
                return console.log(err);
            console.log("CSS File was Created");
        });
    }
    // close the readline interface after files are created
    rl.close();
};
console.clear();
if (!name) {
    console.log("You need to supply a name");
    console.log("Example: npm run component <componentName>");
    console.log("This command creates a Redux container, a stateless or stateful React component, and CSS file in a folder located at src/components/<componentName>");
    console.log("Please try again.");
    rl.close();
}
else {
    if (fs.existsSync("./src/components/" + name)) {
        console.log("A component named " + name + " already exists in src/components/");
        rl.close();
    }
    else {
        askState();
    }
}
