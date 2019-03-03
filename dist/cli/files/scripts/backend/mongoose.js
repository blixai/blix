"use strict";
var fs = require("fs");
var path = require("path");
var name = process.argv[2];
var schemaFields = process.argv.slice(3);
if (!name) {
    console.log("You need give your model a name!");
    console.log("Try: npm run model <name> [fieldName]:[Type]");
    return;
}
schemaFields = schemaFields.map(function (field) {
    if (field.includes(":")) {
        var index = field.indexOf(":");
        var upperCaseLetter = field[index + 1].toUpperCase();
        field = field.split("");
        field.splice(index + 1, 1, upperCaseLetter);
        field = field.join("");
        return field;
    }
    else {
        return field;
    }
});
var schemaTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/schemaTemplate.js"), "utf8");
name = name.charAt(0).toUpperCase() + name.slice(1);
schemaTemplate = schemaTemplate.replace(/Name/, name);
var lowerCaseName = name.toLowerCase();
schemaTemplate = schemaTemplate.replace(/name/g, lowerCaseName);
var validSchemas = [
    "String",
    "Number",
    "Date",
    "Buffer",
    "Boolean",
    "Mixed",
    "ObjectId",
    "Array"
];
var fields = [];
schemaFields.map(function (field) {
    if (field.includes(':')) {
        var check = field.split(":");
        if (validSchemas.includes(check[1])) {
            var newLine = check[0] + ": " + check[1];
            fields.push(newLine);
        }
    }
    else {
        var newLine = field + ": String";
        fields.push(newLine);
    }
});
var body = schemaTemplate.toString().split("\n");
for (var i = fields.length - 1; i >= 0; --i) {
    var string = "      " + fields[i];
    if (i < fields.length - 1) {
        string = string + ",";
    }
    body.splice(5, 0, string);
}
schemaTemplate = body.join("\n");
if (fs.existsSync("./server/models/" + name + ".js")) {
    console.error("Model " + name + " already exists");
    return;
}
fs.writeFile("./server/models/" + name + ".js", schemaTemplate, function (err) {
    if (err)
        throw err;
    console.log("Created model " + name + "!");
});
