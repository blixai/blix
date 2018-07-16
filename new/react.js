const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./createCommonFiles");
const { installReactTesting } = require("./addReactTesting");
const { e2eSetup } = require("./addEndToEndTesting");
const { createBackend } = require("./createBackend");
const { newProjectInstructions } = require("./newProjectInstructions");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load react files
const index = loadFile("./files/frontend/react/index.js");
const app = loadFile("./files/frontend/react/App.js");

// load
const babel = loadFile("./files/frontend/babel/reactBabel");
const webpack = loadFile("./files/frontend/webpack/react.js");
const postcssConfig = loadFile("./files/frontend/postcss.config.js");

// html file for projects without backends
const htmlFile = loadFile("./files/frontend/other/index.html");

const react = (
  reactType,
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

  createSrcContents(reactType);

  // create webpack postcssConfig and babelrc files
  helpers.writeFile(`./${name}/postcss.config.js`, postcssConfig);
  helpers.writeFile(`./${name}/.babelrc`, babel);
  helpers.writeFile(`./${name}/webpack.config.js`, webpack);

  // react testing setup
  installReactTesting(reactTestingSelection);

  // e2e setup
  e2eSetup(e2eSelection);

  // create backend
  if (backend) {
    createBackend(serverTestingSelection, databaseSelection);
  }

  // add scripts
  scripts(reactType, backend);

  // install packages
  packages(backend);

  // console log instructions and add instructions to readme
  // newProjectInstructions(reactType,  );
};

const createSrcContents = reactType => {
  if (reactType === "react") {
    reactOnly();
  } else if (reactType === "react-router") {
    reactRouter();
  } else if (reactType === "redux") {
    redux()
  }
};

const reactOnly = () => {
  fs.mkdirSync(`./${name}/src/App`);
  helpers.writeFile(`./${name}/src/index.js`, index);
  helpers.writeFile(`./${name}/src/App/App.js`, app);
  helpers.writeFile(`./${name}/src/App/App.css`, "");
};

const reactRouter = () => {
  helpers.writeFile(`./${name}/src/index.js`, index);
  helpers.writeFile(`./${name}/src/App.js`, router);

  fs.mkdirSync(`./${name}/src/components`);
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.js`, Navbar);
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.css`, NavbarCSS);
  fs.mkdirSync(`./${name}/src/views`);
  helpers.writeFile(`./${name}/src/views/Home.js`, HomeView);
  helpers.writeFile(`./${name}/src/views/PageNotFound.js`, PageNotFound);

  helpers.writeFile(`./${name}/`);
};

const redux = () => {
  helpers.writeFile(`./${name}/src/index.js`, reduxIndex);
  helpers.writeFile(`./${name}/src/App.js`, reduxRouter);
  // components folder, every component will have a folder with associated css, tests, and/or container for that component
  fs.mkdirSync(`./${name}/src/components`);
  fs.mkdirSync(`./${name}/src/components/Navbar`);
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.js`, Navbar);
  helpers.writeFile(
    `./${name}/src/components/Navbar/NavbarContainer.js`,
    NavbarContainer
  );
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.css`, NavbarCSS);
  // views folder
  fs.mkdirSync(`./${name}/src/views`);
  helpers.writeFile(`./${name}/src/views/Home.js`, ReduxHomeView);
  helpers.writeFile(`./${name}/src/views/PageNotFound.js`, ReduxPageNotFound);

  // need to make actions folder and store file 
};

const scripts = (reactType, backend) => {
  if (!backend) {
    helpers.addScriptToNewPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    helpers.writeFile(`./${name}/index.html`, htmlFile);
  }
  helpers.addScriptToNewPackageJSON("dev", "webpack --watch");
  helpers.addScriptToNewPackageJSON("build", "webpack --mode='production'");
  // need to add scripts for creating containers actions
  if (reactType === "redux") {
    helpers.addScriptToNewPackageJSON("component", "")
    helpers.addScriptToNewPackageJSON("action", "")
  }
};

const packages = backend => {
  if (!backend) {
    helpers.installDevDependencies("webpack-dev-server");
  }
  helpers.installDevDependencies(
    "react react-dom webpack webpack-cli babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader"
  );
};

module.exports = { react };
