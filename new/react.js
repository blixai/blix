const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./createCommonFiles");
const { installReactTesting } = require("./addReactTesting");
const { e2eSetup } = require("./addEndToEndTesting");
const { createBackend } = require("./backend");
const { newProjectInstructions } = require("./newProjectInstructions");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// load common files
const babel = loadFile("./files/frontend/babel/reactBabel");
const webpack = loadFile("./files/frontend/webpack/react.js");
const postcssConfig = loadFile("./files/frontend/postcss.config.js");

// load html file for projects without backends
const htmlFile = loadFile("./files/frontend/other/index.html");

// load react files
const index = loadFile("./files/frontend/react/index.js");
const app = loadFile("./files/frontend/react/App.js");

// load react-router files
const reactRouterIndex = loadFile("./files/frontend/react-router/index.js");
const appRouter = loadFile("./files/frontend/react-router/App.js");
const Navbar = loadFile("./files/frontend/react-router/Navbar.js");
const NavbarCSS = loadFile("./files/frontend/react-router/Navbar.css");
const HomeView = loadFile("./files/frontend/react-router/Home.js");
const globalStyle = loadFile("./files/frontend/react-router/global.css");

// load redux files
const reduxIndex = loadFile("./files/frontend/redux/index.js");
const configStore = loadFile("./files/frontend/redux/configStore.js");
const rootReducer = loadFile("./files/frontend/redux/rootReducer.js");
const ReduxHomeView = loadFile("./files/frontend/redux/Home.js");

const NavbarContainer = loadFile("./files/frontend/redux/NavbarContainer.js");

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
    createBackend("backend", serverTestingSelection, databaseSelection);
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
    redux();
  }
};

const reactOnly = () => {
  fs.mkdirSync(`./${name}/src/App`);
  helpers.writeFile(`./${name}/src/index.js`, index);
  helpers.writeFile(`./${name}/src/App/App.js`, app);
  helpers.writeFile(`./${name}/src/App/App.css`, "");
};

const reactRouter = () => {
  helpers.writeFile(`./${name}/src/index.js`, reactRouterIndex);
  helpers.writeFile(`./${name}/src/App.js`, appRouter);

  fs.mkdirSync(`./${name}/src/components`);
  fs.mkdirSync(`./${name}/src/components/Navbar`);
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.js`, Navbar);
  helpers.writeFile(`./${name}/src/components/Navbar/Navbar.css`, NavbarCSS);
  fs.mkdirSync(`./${name}/src/views`);
  helpers.writeFile(`./${name}/src/views/Home.js`, HomeView);
  // styles folder
  fs.mkdirSync(`./${name}/src/styles`);
  helpers.writeFile(`./${name}/src/styles/global.css`, globalStyle);
  // install react-router-dom for src/index.js file
  helpers.installDevDependencies("react-router-dom");
};

const redux = () => {
  helpers.writeFile(`./${name}/src/index.js`, reduxIndex);
  helpers.writeFile(`./${name}/src/App.js`, appRouter);
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
  // styles folder for views
  fs.mkdirSync(`./${name}/src/styles`);
  helpers.writeFile(`./${name}/src/styles/global.css`, globalStyle);

  // need to make actions folder and store file and configure store and reducers folder with rootReducer.js
  fs.mkdirSync(`./${name}/src/actions`);
  helpers.writeFile(`./${name}/src/actions/index.js`, "");
  fs.mkdirSync(`./${name}/src/reducers`);
  helpers.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer);
  helpers.writeFile(`./${name}/src/configStore.js`, configStore);
  //install react-router-dom and other redux specific libs
  helpers.installDevDependencies("redux react-redux react-router-dom");
};

const scripts = (reactType, backend) => {
  if (!backend) {
    helpers.addScriptToNewPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    helpers.writeFile(`./${name}/index.html`, htmlFile);
  }
  helpers.addScriptToNewPackageJSON(
    "dev",
    "webpack --watch --mode='development'"
  );
  helpers.addScriptToNewPackageJSON("build", "webpack --mode='production'");
  // need to add scripts for creating containers actions
  if (reactType === "react") {
    reactScripts();
  } else if (reactType === "react-router") {
    reactRouterScripts();
  } else if (reactType === "redux") {
    reduxScripts();
  }
};

const reactScripts = () => {
  helpers.writeFile(
    `./${name}/scripts/component.js`,
    loadFile("./files/scripts/frontend/react/component.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statefulComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statelessComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  );
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
};

const reactRouterScripts = () => {
  helpers.writeFile(
    `./${name}/scripts/component.js`,
    loadFile("./files/scripts/frontend/react-router/component.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statefulComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statelessComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  );
  helpers.writeFile(
    `./${name}/scripts/view.js`,
    loadFile("./files/scripts/frontend/react-router/view.js")
  );
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToNewPackageJSON("view", "node scripts/view.js");
};

const reduxScripts = () => {
  // action script and templates
  helpers.writeFile(
    `./${name}/scripts/action.js`,
    loadFile("./files/scripts/frontend/redux/action.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/action.js`,
    loadFile("./files/scripts/frontend/redux/templates/action.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/reducer.js`,
    loadFile("./files/scripts/frontend/redux/templates/reducer.js")
  );
  // component script and templates
  helpers.writeFile(
    `./${name}/scripts/component.js`,
    loadFile("./files/scripts/frontend/redux/component.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statelessComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/container.js`,
    loadFile("./files/scripts/frontend/redux/templates/container.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/statefulComponent.js`,
    loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  );
  // view script
  helpers.writeFile(
    `./${name}/scripts/view.js`,
    loadFile("./files/scripts/frontend/redux/view.js")
  );

  // add scripts for action and component to package.json
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToNewPackageJSON("action", "node scripts/action.js");
  helpers.addScriptToNewPackageJSON("view", "node scripts/view.js");
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
