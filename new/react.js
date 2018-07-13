const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./createCommonFiles");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load files
// const webpack
const babel = loadFile("./files/frontend/babel/reactBabel");
const index = loadFile("./files/frontend/index.js");
const app = loadFile("./files/frontend/react/App.js");

const htmlFile = loadFile("./files/frontend/other/index.html");
const postcssConfig = loadFile("./files/frontend/postcss.config.js");

const react = (
  reactTestingSelection,
  e2eSelection,
  backend,
  serverTestingSelection,
  databaseSelection
) => {
  // create common files and folders
  createCommonFilesAndFolders();

  // create react files
  fs.mkdirSync(`./${name}/dist`);
  fs.mkdirSync(`./${name}/src`);
  helpers.writeFile(`./${name}/src/index.js`, index);
  fs.mkdirSync(`./${name}/src/App`);
  helpers.writeFile(`./${name}/src/App/App.js`, app);
  helpers.writeFile(`./${name}/src/App/App.css`, "");
  helpers.writeFile(`./${name}/postcss.config.js`, postcssConfig);
  helpers.writeFile(`./${name}/.babelrc`, babel);

  // if no backend add webpack dev server and index.html in project, and different scripts to
  if (backend) {
  } else {
  }
  // if backend selected create backend

  // add scripts

  // install packages

  // console log instructions
};

module.exports = { react };
