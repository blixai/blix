"use strict";
var _a = require('blix'), writeFile = _a.writeFile, loadFile = _a.loadFile, parseArgs = _a.parseArgs;
var fs = require('fs');
var _b = parseArgs(process.argv), name = _b.name, options = _b.options, fields = _b.fields;
if (fs.existsSync("./src/components/" + name + ".vue")) {
    console.error("That component already exists at src " + name);
    process.exit();
}
var template = loadFile('component.vue');
template = template.replace(/Name/g, "" + name);
writeFile("src/components/" + name + ".vue", template);
