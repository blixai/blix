"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var chalk = require('chalk');
var namePrompt = {
    type: 'input',
    message: 'Please provide a name for your project: ',
    name: 'name'
};
var defaultOrCustom = {
    type: "list",
    message: "Please select a preset: ",
    name: "preset",
    choices: [
        { name: "default: (" + chalk.yellow(__makeTemplateObject(["React"], ["React"])) + ", " + chalk.yellow(__makeTemplateObject(["React-Router"], ["React-Router"])) + ", " + chalk.yellow(__makeTemplateObject(["Redux"], ["Redux"])) + ", " + chalk.yellow(__makeTemplateObject(["Express"], ["Express"])) + ", " + chalk.yellow(__makeTemplateObject(["MongoDB"], ["MongoDB"])) + ", " + chalk.yellow(__makeTemplateObject(["Mongoose"], ["Mongoose"])) + ")", value: "react-default" },
        { name: "Manually Select Features", value: "manual" }
    ]
};
var frontendOptions = {
    type: "list",
    message: "Select a Frontend Framework:",
    name: "frontend",
    choices: [
        { name: "React", value: "react" },
        { name: "React, React-Router", value: "react-router" },
        { name: "React, Redux ", value: "redux" },
        { name: "React, Redux, React-Router", value: "reactRouter-redux" },
        { name: "Vue", value: "vue" },
        { name: "Vue, Vue-Router", value: "vue-router" },
        { name: "Vue, Vuex", value: "vuex" },
        { name: "Vue, Vuex, Vue-Router", value: "vueRouter-vuex" },
        // { name: "Vanilla JS", value: "js" },
        { name: "None (Express.js as an API backend)", value: "none" }
    ]
};
var backend = {
    type: "confirm",
    message: "Do you need an Express.js backend",
    name: "backend"
};
var backendType = {
    type: "list",
    message: "What type of backend do you need",
    name: "mode",
    choices: [
        { name: "MVC", value: "mvc" },
        { name: "Standard (serve html files, assets, and create JSON rest endpoints)", value: "standard" },
        { name: "API", value: "api" }
    ]
};
var database = {
    type: "list",
    message: "Select a Database:",
    name: "database",
    choices: [
        { name: "MongoDB", value: "mongo" },
        { name: "Postgres", value: 'pg' },
        { name: "None" }
    ]
};
var serverTesting = {
    type: "list",
    message: "Do you want to test server routes with:",
    name: "server",
    choices: [
        { name: "Mocha & Chai", value: "mocha" },
        { name: "Jest", value: "jest" },
        { name: "None" }
    ]
};
var e2e = {
    type: "list",
    message: "End to End Testing Tool: (warning: large downloads)",
    name: "e2e",
    choices: [
        { name: "Test Cafe", value: "cafe" },
        { name: "Cypress", value: "cypress" },
        { name: "None" }
    ]
};
var reactTesting = {
    type: "confirm",
    message: "Do you want to install Jest and Enzyme for React Testing",
    name: "enzyme"
};
var vueTesting = {
    type: "list",
    message: "Select a unit testing library for Vue",
    name: "vueTesting",
    choices: [
        { name: "Vue Testing Utils", value: "utils" },
        { name: "Karma.js", value: "karma" },
        { name: "Jest", value: "jest" },
        { name: "None", value: "none" }
    ]
};
var reactCSS = {
    type: "list",
    message: "Select a CSS Library",
    name: "css",
    choices: [
        { name: 'Material-UI', value: "material" },
        { name: 'React-Bootstrap', value: 'bootstrap' },
        { name: 'Styled-Components', value: 'styled' },
        { name: 'None', value: '' }
    ]
};
var yarnPrompt = {
    type: 'confirm',
    message: 'Do you want to use Yarn to install packages',
    name: "yarn"
};
var linterPrompt = {
    type: "list",
    message: 'Select a linter',
    name: 'linter',
    choices: [
        { name: 'Prettier', value: 'prettier' },
        { name: 'ESLint', value: 'eslint' },
        { name: 'ESLint + Prettier', value: 'eslint_prettier' },
        { name: 'None' }
    ]
};
var helpCommands = {
    type: 'list',
    message: 'Learn more about:',
    name: 'help',
    choices: [
        { name: 'new' },
        { name: 'scripts' },
        { name: 'add' },
        { name: 'generate' }
    ]
};
module.exports = {
    namePrompt: namePrompt,
    defaultOrCustom: defaultOrCustom,
    frontendOptions: frontendOptions,
    backend: backend,
    backendType: backendType,
    database: database,
    serverTesting: serverTesting,
    e2e: e2e,
    reactTesting: reactTesting,
    vueTesting: vueTesting,
    reactCSS: reactCSS,
    yarnPrompt: yarnPrompt,
    linterPrompt: linterPrompt,
    helpCommands: helpCommands
};
