"use strict";
var fs = require("fs");
var path = require("path");
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
var log = console.log;
var lowercase;
var upperCase;
var globalReducer;
rl.question("? What is the actions name: ", function (ans) {
    lowercase = ans.toLowerCase();
    upperCase = ans.toUpperCase();
    var existingActions = fs
        .readFileSync("./src/actions/index.js", "utf8")
        .toString();
    if (existingActions.indexOf(lowercase) !== -1) {
        log("Action " + lowercase + " already exists.");
    }
    else {
        var actionTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/action.js"), "utf8");
        actionTemplate = actionTemplate.replace(/name/g, lowercase);
        actionTemplate = actionTemplate.replace(/NAME/g, upperCase);
        fs.appendFile("./src/actions/index.js", actionTemplate, function (err) {
            if (err)
                throw err;
        });
    }
    rl.question("? What is the reducers name: ", function (reducer) {
        globalReducer = reducer.toLowerCase();
        if (fs.existsSync("./src/reducers/" + globalReducer + ".js")) {
            // add it to the switch
            var body = fs
                .readFileSync("./src/reducers/" + globalReducer + ".js", "utf8")
                .toString();
            if (body.indexOf("case \"" + upperCase + "\":") !== -1) {
                // action exists in reducer, dont add
                log("Action " + lowercase + " already exists in " + globalReducer);
                importAction();
            }
            else {
                var search = "switch (action.type) {";
                var position = body.indexOf(search);
                if (position !== -1) {
                    var newAction = "\n\t\tcase \"" + upperCase + "\":\n\t\t\treturn action.payload";
                    var output = [
                        body.slice(0, position + 22),
                        newAction,
                        body.slice(position + 22)
                    ].join("");
                    fs.writeFile("./src/reducers/" + globalReducer + ".js", output, function (err) {
                        if (err)
                            throw err;
                        importAction();
                    });
                }
                else {
                    console.log("Reducer file found but something went wrong. Check the file for a switch statement.");
                    rl.close();
                }
            }
        }
        else {
            // create reducer
            var reducerTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/reducer.js"), "utf8");
            reducerTemplate = reducerTemplate.replace(/NAME/g, upperCase);
            reducerTemplate = reducerTemplate.replace(/name/g, globalReducer);
            fs.writeFile("./src/reducers/" + reducer + ".js", reducerTemplate, function (err) {
                if (err)
                    throw err;
            });
            // append it to rootreducer
            var search = "combineReducers({";
            var body = fs
                .readFileSync("./src/reducers/rootReducer.js", "utf8")
                .toString()
                .split("\n");
            body.splice(1, 0, "import " + reducer + " from './" + reducer + "'");
            var newBody = body.join("\n");
            var output = void 0;
            var position = void 0;
            var newReducer = void 0;
            var commaDeterminer = "combineReducers({})";
            if (newBody.indexOf(commaDeterminer) !== -1) {
                position = newBody.indexOf(search);
                newReducer = "\n\t" + reducer + "\n";
                output = [
                    newBody.slice(0, position + 17),
                    newReducer,
                    newBody.slice(position + 17)
                ].join("");
            }
            else {
                position = newBody.indexOf(search);
                newReducer = "\n\t" + reducer + ",";
                output = [
                    newBody.slice(0, position + 17),
                    newReducer,
                    newBody.slice(position + 17)
                ].join("");
            }
            fs.writeFile("./src/reducers/rootReducer.js", output, function (err) {
                if (err)
                    throw err;
                importAction();
            });
        }
    });
});
var importAction = function () {
    var folders = [];
    var p = "./src";
    fs.readdirSync("./src").forEach(function (file) {
        var filePath = p + "/" + ("" + file);
        var stats = fs.statSync(filePath, "utf8");
        if (stats.isDirectory() && file !== 'reducers' && file !== 'api' && file !== 'actions') {
            folders.push(file);
        }
    });
    log("Containers: ", folders);
    rl.question("Which containers should this action apply to? ", function (containers) {
        containers = containers.toLowerCase().split(" ");
        containers.map(function (folder) {
            folder = folder.charAt(0).toUpperCase() + folder.slice(1);
            if (folders.includes(folder)) {
                var container = fs
                    .readFileSync("./src/" + folder + "/" + folder + "Container.js", "utf8")
                    .toString();
                var search = "} from '../../actions'";
                if (container.indexOf(search) !== -1) {
                    // if import from actions already exists then insert a new one with a comma before it
                    var index = container.indexOf(search);
                    var action = ", " + lowercase + " ";
                    container = [
                        container.slice(0, index),
                        action,
                        container.slice(index)
                    ];
                    var mapDispatchToProps = "const mapDispatchToProps";
                    container = container.join("");
                    if (container.indexOf(mapDispatchToProps) !== -1) {
                        // if mapDispatch to props function exists then insert the handle action to it
                        var capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
                        var handler = "handle" + capitalizeAction + ": (input) => {\n\t\t\tdispatch(" + lowercase + "(input))\n\t\t},\n\t\t";
                        var find = "const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\t";
                        var foundIndex = container.indexOf(find);
                        container = [
                            container.slice(0, foundIndex + find.length),
                            handler,
                            container.slice(foundIndex + find.length)
                        ].join("");
                        fs.writeFile("./src/" + folder + "/" + folder + "Container.js", container, function (err) {
                            if (err)
                                console.error(err);
                        });
                    }
                    else {
                        // mapDispatch doesnt exist create it, probably also see if its connected
                        container = container.split("\n");
                        var capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
                        var addDispatch = "const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\thandle" + capitalizeAction + ": (input) =>{\n\t\t\tdispatch(" + lowercase + "(input))\n\t\t}\n\t}\n}";
                        container.splice(8, 0, addDispatch);
                        container = container.join("\n");
                        container = container.replace(/null/g, "mapDispatchToProps");
                        fs.writeFile("./src/" + folder + "/" + folder + "Container.js", container, function (err) {
                            if (err)
                                console.error(err);
                            log("imported " + lowercase + " into " + folder + "Container and created mapDispatchToProps");
                        });
                    }
                }
                else {
                    // add import action, add mapDispatchToProps, and add mapDispatchtoprops to connect at bottom of file
                    container = container.split("\n");
                    var capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
                    container.splice(1, 0, "import { " + lowercase + " } from '../../actions'");
                    var addDispatch = "const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\thandle" + capitalizeAction + ": (input) => {\n\t\t\tdispatch(" + lowercase + "(input))\n\t\t}\n\t}\n}\n\n";
                    container.splice(8, 0, addDispatch);
                    container = container.join("\n");
                    container = container.replace(/null/g, "mapDispatchToProps");
                    fs.writeFile("./src/" + folder + "/" + folder + "Container.js", container, function (err) {
                        if (err)
                            throw err;
                        log("imported " + lowercase + " into " + folder + "Container and created mapDispatchToProps");
                    });
                    // probably need to dispatch it and make sure it is connected when exported
                }
            }
        });
        rl.close();
    });
};
