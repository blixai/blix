"use strict";
var fs = require("fs");
var path = require("path");
var readLine = require("readline");
var rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
var log = console.log;
// helper function to load files
var loadFile = function (filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};
// assign name and ensure name given is capitalized as view is still a react class
var name = process.argv[2] || "";
var capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);
// need to see if view should be stateful or stateless
var askRoute = function () {
    rl.question("? Please enter the url route to the view: ", function (answer) {
        if (answer !== "") {
            // check for character for a '/' if it has one remove it
            if (answer.charAt(0) === "/") {
                answer = answer.slice(1);
            }
            askState(answer);
        }
        else {
            log("No route entered. Please try again");
            askRoute();
        }
    });
};
var askState = function (route) {
    rl.question("? Is this view stateful: (Y/n) ", function (answer) {
        answer = answer.toLowerCase();
        if (answer === "y") {
            createStatefulView(route);
        }
        else {
            createStatelessView(route);
        }
        addComponentsToView();
    });
};
var createStatefulView = function (route) {
    var data = loadFile("./templates/statefulComponent.js");
    var stateful = data.replace(/Name/g, "" + name);
    stateful = stateful.replace(/Name/g, "" + name);
    stateful = stateful.split("\n");
    stateful.splice(1, 1);
    stateful = stateful.join("\n");
    try {
        fs.writeFileSync("./src/views/" + name + ".js", stateful);
        console.log("Created view: " + name + " in src/views/");
    }
    catch (err) {
        console.error(err);
    }
    addRoute(route);
};
var createStatelessView = function (route) {
    var stateless = loadFile("./templates/statelessComponent.js");
    stateless = stateless.replace(/Name/g, "" + name);
    stateless = stateless.split("\n");
    stateless.splice(1, 1);
    stateless = stateless.join("\n");
    try {
        fs.writeFileSync("./src/views/" + name + ".js", stateless);
        console.log("Created view: " + name + " in src/views/");
    }
    catch (err) {
        console.error(err);
    }
    addRoute(route);
};
var addRoute = function (route) {
    // need to check if route already exists
    var search = "<Switch>";
    var body = fs.readFileSync("./src/Router.js", "utf8").toString();
    // if route already exists in Router.js log warning and return
    if (body.indexOf("/" + route) !== -1) {
        console.log("Route already exists in src/Router.js!!");
        return;
    }
    body = body.split("\n");
    body.splice(3, 0, "import " + name + " from './views/" + name + "'");
    var newBody = body.join("\n");
    var position = newBody.indexOf(search);
    var newRoute = "\n\t\t\t\t  <Route exact path='/" + route + "' render={(history) => {\n\t\t\t\t    return <" + name + "/>\n\t\t\t\t  }}/>";
    var output = [
        newBody.slice(0, position + 8),
        newRoute,
        newBody.slice(position + 8)
    ].join("");
    try {
        fs.writeFileSync("./src/Router.js", output);
        console.log("Created route: /" + route + " in src/Router.js");
    }
    catch (err) {
        console.error(err);
    }
};
var addComponentsToView = function () {
    var folders = [];
    var files = [];
    var p = "./src/components";
    fs.readdirSync("./src/components").forEach(function (folder) {
        var filePath = p + "/" + ("" + folder);
        var stats = fs.statSync(filePath, "utf8");
        if (stats.isDirectory()) {
            folders.push(folder);
        }
    });
    folders.map(function (folder) {
        var filePath = p + "/" + ("" + folder);
        fs.readdirSync(filePath).forEach(function (file) {
            if (file.includes(".js") && !file.includes('.spec') && !file.includes('.test')) {
                file = file.replace(".js", "");
                files.push(file);
            }
        });
    });
    log("Components/Containers: ", files);
    rl.question("? Which components should be used by this view: (you can enter more than one at a time, case-sensitive) ", function (components) {
        rl.close();
        components = components.split(" ");
        components.map(function (component) {
            if (files.includes(component)) {
                var view = fs
                    .readFileSync("./src/views/" + name + ".js", "utf8")
                    .toString();
                var componentFolder = component;
                if (componentFolder.includes("Container")) {
                    componentFolder = componentFolder.replace("Container", "");
                }
                var search = "import " + component + " from '../components/" + componentFolder + "/" + component + "';";
                var secondSearch = "import " + component + "Component from '../components/" + componentFolder + "/" + component + "';";
                if (view.indexOf(search) !== -1 || view.indexOf(secondSearch) !== -1) {
                    log("This view already has the " + component + " component");
                }
                else if (view.indexOf(component) !== -1) {
                    view = view.split("\n");
                    view.splice(1, 0, secondSearch);
                    view = view.join("\n");
                    try {
                        fs.writeFileSync("./src/views/" + name + ".js", view);
                        console.log("Imported " + component + " into view/" + name + ".js");
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                else {
                    // rewrite the view
                    view = view.split("\n");
                    view.splice(1, 0, search);
                    view = view.join("\n");
                    try {
                        fs.writeFileSync("./src/views/" + name + ".js", view);
                        console.log("Imported " + component + " into view/" + name + ".js");
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            }
        });
    });
};
console.clear();
if (name) {
    // see if its a new view, if not ask to add components/containers or styles
    if (fs.existsSync("./src/views/" + name + ".js")) {
        rl.question("? That view already exists, do you want to add components to that view: (Y/n) ", function (answer) {
            answer = answer.toLowerCase();
            if (answer === "y") {
                addComponentsToView();
            }
            else {
                process.exit();
            }
        });
    }
    else {
        askRoute();
    }
}
else {
    log("No View name provided.");
    log("Example: npm run view about");
    log("This will create a component About in src/views and add a route to src/Router.js as well as give the option to import components or containers into the view");
    log("Please try again");
    process.exit();
}
