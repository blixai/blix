"use strict";
var fs = require("fs");
var path = require("path");
var modelName = process.argv[2];
var execSync = require("child_process").execSync;
var tableColumns = process.argv.slice(3);
if (!modelName) {
    console.log("no model name provided");
    process.exit();
}
modelName = modelName.toLowerCase();
modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
var bookshelf = fs.readFileSync(path.resolve(__dirname, "./templates/bookshelf.js"), "utf8");
bookshelf = bookshelf.replace(/LowerCasePlural/g, modelName.toLowerCase() + "s");
bookshelf = bookshelf.replace(/ModelName/g, modelName);
fs.writeFile("./server/models/" + modelName + ".js", bookshelf, function (err) {
    if (err)
        return console.error(err);
    console.log("Created Model " + modelName);
});
try {
    execSync("knex migrate:make " + modelName.toLowerCase() + "s");
}
catch (e) {
    console.error(e);
    process.exit(1);
}
var migration = fs.readFileSync(path.resolve(__dirname, "./templates/migration.js"), "utf8");
migration = migration.replace(/Name/g, modelName.toLowerCase() + "s");
var possibleFields = [
    "string",
    "binary",
    "boolean",
    "date",
    "dateTime",
    "decimal",
    "float",
    "integer",
    "bigInteger",
    "text",
    "json",
    "jsonb"
];
var fields = [];
tableColumns.map(function (field) {
    if (field.includes(":")) {
        field = field.toLowerCase();
        var check = field.split(":");
        if (possibleFields.includes(check[1])) {
            var newLine = "t." + check[1] + "('" + check[0] + "')";
            fields.push(newLine);
        }
    }
    else {
        var newLine = "t.string('" + field + "')";
        fields.push(newLine);
    }
});
var body = migration.toString().split("\n");
for (var i = fields.length - 1; i >= 0; --i) {
    body.splice(4, 0, "      " + fields[i]);
}
migration = body.join("\n");
fs.readdir("./db/migrations", function (err, files) {
    if (err)
        throw err;
    for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf("" + modelName.toLowerCase()) !== -1) {
            try {
                fs.truncateSync("./db/migrations/" + files[i], 0);
                fs.writeFileSync("./db/migrations/" + files[i], migration);
                console.log("Created migration file " + files[i]);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
});
