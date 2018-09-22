const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./utils/createCommonFiles");
const { installReactTesting } = require("./utils/addReactTesting");
const { e2eSetup } = require("./utils/addEndToEndTesting");
const { newProjectInstructions } = require('./utils/newProjectInstructions')
const { createBackend } = require("./backend");
const name = process.argv[3];
const store = require('./store')

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
const reduxIndex = loadFile('./files/frontend/redux/reduxIndex.js')
const reduxAppContainer = loadFile('./files/frontend/redux/AppContainer.js')
const reactRouterReduxIndex = loadFile("./files/frontend/redux/reactRouterReduxIndex.js");
const configStore = loadFile("./files/frontend/redux/configStore.js");
const rootReducer = loadFile("./files/frontend/redux/rootReducer.js");
const ReduxHomeView = loadFile("./files/frontend/redux/Home.js");

const NavbarContainer = loadFile("./files/frontend/redux/NavbarContainer.js");

const react = async () => {
  createCommonFilesAndFolders();

  // create react files
  fs.mkdirSync(`./${name}/dist`);
  fs.mkdirSync(`./${name}/src`);
  // A FOLDER TO HOLD FILES WITH RESOURCE FETCH CALLS TO ONE RESOURCE PER FILE (similar to controllers server side)
  fs.mkdirSync(`./${name}/src/services`);

  // build project specific contents based on type supplied from new/index.js
  await createSrcContents();

  // create webpack postcssConfig and babelrc files
  helpers.writeFile(`./${name}/postcss.config.js`, postcssConfig);
  helpers.writeFile(`./${name}/.babelrc`, babel);
  helpers.writeFile(`./${name}/webpack.config.js`, webpack);

  // react testing setup
  await installReactTesting();

  // e2e setup
  await e2eSetup();

  // add scripts
  scripts();

  // install packages
  await packages();

  // create backend
  if (store.backend && store.backend.backend) {
    store.backendType = "standard"
    createBackend()
    // createBackend("backend", store.serverTesting, store.database);
  } else {
    newProjectInstructions()
  }
};

const createSrcContents = async () => {
  if (store.reactType === "react") {
    await reactOnly();
  } else if (store.reactType === "react-router") {
    await reactRouter();
  } else if (store.reactType === "redux") {
    await redux()
  } else if (store.reactType === "reactRouter-redux") {
    await reactRouterRedux();
  }
};

const reactOnly = () => {
  fs.mkdirSync(`./${name}/src/App`);
  helpers.writeFile(`./${name}/src/index.js`, index);
  helpers.writeFile(`./${name}/src/App/App.js`, app);
  helpers.writeFile(`./${name}/src/App/App.css`, "");
};

const reactRouter = async () => {
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
  await helpers.installDevDependencies("react-router-dom");
};

const redux = async () => {
  helpers.writeFile(`./${name}/src/index.js`, reduxIndex)
  fs.mkdirSync(`./${name}/src/App`)
  helpers.writeFile(`./${name}/src/App/App.js`, app)
  helpers.writeFile(`./${name}/src/App/AppContainer.js`, reduxAppContainer)
  helpers.writeFile(`./${name}/src/App/App.css`, "")

  fs.mkdirSync(`./${name}/src/actions`)
  helpers.writeFile(`./${name}/src/actions/index.js`, "")

  fs.mkdirSync(`./${name}/src/reducers`)
  helpers.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer);
  helpers.writeFile(`./${name}/src/configStore.js`, configStore);

  await helpers.install("redux react-redux")

}

const reactRouterRedux = async () => {
  helpers.writeFile(`./${name}/src/index.js`, reactRouterReduxIndex);
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
  await helpers.installDevDependencies("redux react-redux react-router-dom");
};

const scripts = () => {
  if (!store.backend.backend) {
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
  if (store.reactType === "react") {
    reactScripts();
  } else if (store.reactType === "react-router") {
    reactRouterScripts();
  } else if (store.reactType === 'redux') {
    reduxScripts()
  } else if (store.reactType === "reactRouter-redux") {
    reactRouterReduxScripts();
  }
};

const reactScripts = () => {
  let component = loadFile("./files/scripts/frontend/react/component.js")
  let statefulComponentTemplate = loadFile('./files/scripts/frontend/react/templates/statefulComponent.js')
  let statelessComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")

  helpers.writeFile(`./${name}/scripts/component.js`, component);
  helpers.writeFile(`./${name}/scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`./${name}/scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
};

const reactRouterScripts = () => {
  let component = loadFile("./files/scripts/frontend/react-router/component.js")
  let statefulComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  let statelessComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  let view = loadFile('./files/scripts/frontend/react-router/view.js')

  helpers.writeFile(`./${name}/scripts/component.js`, component);
  helpers.writeFile(`./${name}/scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`./${name}/scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`./${name}/scripts/view.js`, view);
  // add scripts to package.json
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToNewPackageJSON("view", "node scripts/view.js");
};

const reduxScripts = () => {
  let action = loadFile("./files/scripts/frontend/redux/action.js")
  let actionTemplate = loadFile("./files/scripts/frontend/redux/templates/action.js")
  let reducerTemplate = loadFile("./files/scripts/frontend/redux/templates/reducer.js")
  let component = loadFile("./files/scripts/frontend/redux/component.js")
  let statelessComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  let containerTemplate = loadFile("./files/scripts/frontend/redux/templates/container.js")
  let statefulComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")

  // action script and templates
  helpers.writeFile(`./${name}/scripts/action.js`, action)
  helpers.writeFile(`./${name}/scripts/templates/action.js`, actionTemplate)
  helpers.writeFile(`./${name}/scripts/templates/reducer.js`, reducerTemplate)
  // component script and templates
  helpers.writeFile(`./${name}/scripts/component.js`, component) 
  helpers.writeFile(`./${name}/scripts/templates/statelessComponent.js`, statelessComponentTemplate)
  helpers.writeFile(`./${name}/scripts/templates/container.js`, containerTemplate)
  helpers.writeFile(`./${name}/scripts/templates/statefulComponent.js`, statefulComponentTemplate)

  // add scripts for action and component to package.json
  helpers.addScriptToNewPackageJSON('component', 'node scripts/component.js')
  helpers.addScriptToNewPackageJSON('action', 'node scripts/action.js')
}

const reactRouterReduxScripts = () => {
  let action = loadFile("./files/scripts/frontend/reactRouter-redux/action.js")
  let actionTemplate = loadFile("./files/scripts/frontend/redux/templates/action.js")
  let reducerTemplate = loadFile("./files/scripts/frontend/redux/templates/reducer.js")
  let component = loadFile("./files/scripts/frontend/reactRouter-redux/component.js")
  let statelessComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  let containerTemplate = loadFile("./files/scripts/frontend/redux/templates/container.js")
  let statefulComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  let view = loadFile('./files/scripts/frontend/reactRouter-redux/view.js')
  // action script and templates
  helpers.writeFile(`./${name}/scripts/action.js`, action)
  helpers.writeFile(`./${name}/scripts/templates/action.js`, actionTemplate);
  helpers.writeFile(`./${name}/scripts/templates/reducer.js`, reducerTemplate);
  // component script and templates
  helpers.writeFile(`./${name}/scripts/component.js`, component);
  helpers.writeFile(`./${name}/scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`./${name}/scripts/templates/container.js`, containerTemplate);
  helpers.writeFile(`./${name}/scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  // view script
  helpers.writeFile(`./${name}/scripts/view.js`, view);

  // add scripts for action and component to package.json
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToNewPackageJSON("action", "node scripts/action.js");
  helpers.addScriptToNewPackageJSON("view", "node scripts/view.js");
};

const packages = async () => {
  if (!store.backend.backend) {
    await helpers.installDevDependencies("webpack-dev-server");
  }
  await helpers.installDevDependencies(
    "react react-dom webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/preset-react style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader"
  );
};

module.exports = { react };
