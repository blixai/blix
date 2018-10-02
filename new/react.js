const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./utils/createCommonFiles");
const { installReactTesting } = require("./utils/addReactTesting");
const { e2eSetup } = require("./utils/addEndToEndTesting");
const { newProjectInstructions } = require('./utils/newProjectInstructions')
const { createBackend } = require("./backend");
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
const cssFile = loadFile("./files/frontend/other/App.css");

// load react files
const index = loadFile("./files/frontend/react/index.js");
const app = loadFile("./files/frontend/react/App.js");

// load react-router files
const reactRouterIndex = loadFile("./files/frontend/react-router/index.js");
const appRouter = loadFile("./files/frontend/react-router/Router.js");
const Navbar = loadFile("./files/frontend/react-router/Navbar.js");
const NavbarCSS = loadFile("./files/frontend/react-router/Navbar.css");
const HomeView = loadFile("./files/frontend/react-router/Home.js");
const globalStyle = loadFile("./files/frontend/react-router/global.css");

// load redux files
const reduxIndex = loadFile('./files/frontend/redux/index.js')
const reduxAppContainer = loadFile('./files/frontend/redux/AppContainer.js')
const reactRouterReduxIndex = loadFile("./files/frontend/reactRouter-redux/index.js");
const configStore = loadFile("./files/frontend/redux/configStore.js");
const rootReducer = loadFile("./files/frontend/redux/rootReducer.js");
const ReduxHomeView = loadFile("./files/frontend/redux/Home.js");

const NavbarContainer = loadFile("./files/frontend/redux/NavbarContainer.js");

const react = async () => {
  createCommonFilesAndFolders();

  // create react files
  helpers.mkdirSync(`dist`);
  helpers.mkdirSync(`src`);
  // A FOLDER TO HOLD FILES WITH RESOURCE FETCH CALLS TO ONE RESOURCE PER FILE (similar to controllers server side)
  helpers.mkdirSync(`src/services`);

  // build project specific contents based on type supplied from new/index.js
  createSrcContents();

  // create webpack postcssConfig and babelrc files
  helpers.writeFile(`postcss.config.js`, postcssConfig);
  helpers.writeFile(`.babelrc`, babel);
  helpers.writeFile(`webpack.config.js`, webpack);

  cssLibrary()
  // react testing setup
  installReactTesting();

  // e2e setup
  e2eSetup();

  // add scripts
  scripts();

  // add packages to store
  packages();

  // create backend
  if (store.backend && store.backend.backend) {
    store.backendType = "standard"
    createBackend()
    // createBackend("backend", store.serverTesting, store.database);
  } else {
    await helpers.installAllPackages()
    newProjectInstructions()
  }
};

const cssLibrary = () => {
  if (store.reactCSS === 'material') {
    helpers.addDevDependenciesToStore('@material-ui/core')
  } else if (store.reactCSS === 'bootstrap') {
    helpers.addDevDependenciesToStore('react-bootstrap')
  } else if (store.reactCSS === 'styled') {
    helpers.addDevDependenciesToStore('styled-components')
  }
}

const createSrcContents = () => {
  if (store.reactType === "react") {
    reactOnly();
  } else if (store.reactType === "react-router") {
    reactRouter();
  } else if (store.reactType === "redux") {
    redux()
  } else if (store.reactType === "reactRouter-redux") {
    reactRouterRedux();
  }
};

const reactOnly = () => {
  helpers.mkdirSync(`src/App`);
  helpers.writeFile(`src/index.js`, index);
  helpers.writeFile(`src/App/App.js`, app);
  helpers.writeFile(`src/App/App.css`, cssFile);
};

const reactRouter = () => {
  helpers.writeFile(`src/index.js`, reactRouterIndex);
  helpers.writeFile(`src/Router.js`, appRouter);

  helpers.mkdirSync(`src/components`);
  helpers.mkdirSync(`src/components/Navbar`);
  helpers.writeFile(`src/components/Navbar/Navbar.js`, Navbar);
  helpers.writeFile(`src/components/Navbar/Navbar.css`, NavbarCSS);
  helpers.mkdirSync(`src/views`);
  helpers.writeFile(`src/views/Home.js`, HomeView);
  // styles folder
  helpers.mkdirSync(`src/styles`);
  helpers.writeFile(`src/styles/global.css`, globalStyle);
  // install react-router-dom for src/index.js file
  helpers.addDevDependenciesToStore("react-router-dom");
};

const redux = () => {
  helpers.writeFile(`src/index.js`, reduxIndex)
  helpers.mkdirSync(`src/App`)
  helpers.writeFile(`src/App/App.js`, app)
  helpers.writeFile(`src/App/AppContainer.js`, reduxAppContainer)
  helpers.writeFile(`src/App/App.css`, cssFile)

  helpers.mkdirSync(`src/actions`)
  helpers.writeFile(`src/actions/index.js`, "")

  helpers.mkdirSync(`src/reducers`)
  helpers.writeFile(`src/reducers/rootReducer.js`, rootReducer);
  helpers.writeFile(`src/configStore.js`, configStore);

  helpers.addDevDependenciesToStore("redux react-redux")

}

const reactRouterRedux = () => {
  helpers.writeFile(`src/index.js`, reactRouterReduxIndex);
  helpers.writeFile(`src/Router.js`, appRouter);
  // components folder, every component will have a folder with associated css, tests, and/or container for that component
  helpers.mkdirSync(`src/components`);
  helpers.mkdirSync(`src/components/Navbar`);
  helpers.writeFile(`src/components/Navbar/Navbar.js`, Navbar);
  helpers.writeFile(
    `src/components/Navbar/NavbarContainer.js`,
    NavbarContainer
  );
  helpers.writeFile(`src/components/Navbar/Navbar.css`, NavbarCSS);
  // views folder
  helpers.mkdirSync(`src/views`);
  helpers.writeFile(`src/views/Home.js`, ReduxHomeView);
  // styles folder for views
  helpers.mkdirSync(`src/styles`);
  helpers.writeFile(`src/styles/global.css`, globalStyle);

  // need to make actions folder and store file and configure store and reducers folder with rootReducer.js
  helpers.mkdirSync(`src/actions`);
  helpers.writeFile(`src/actions/index.js`, "");
  helpers.mkdirSync(`src/reducers`);
  helpers.writeFile(`src/reducers/rootReducer.js`, rootReducer);
  helpers.writeFile(`src/configStore.js`, configStore);
  //install react-router-dom and other redux specific libs
  helpers.addDevDependenciesToStore("redux react-redux react-router-dom");
};

const scripts = () => {
  if (!store.backend.backend) {
    helpers.addScriptToNewPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    helpers.writeFile(`index.html`, htmlFile);
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

  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
};

const reactRouterScripts = () => {
  let component = loadFile("./files/scripts/frontend/react-router/component.js")
  let statefulComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statefulComponent.js")
  let statelessComponentTemplate = loadFile("./files/scripts/frontend/react/templates/statelessComponent.js")
  let view = loadFile('./files/scripts/frontend/react-router/view.js')

  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`scripts/view.js`, view);
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
  helpers.writeFile(`scripts/action.js`, action)
  helpers.writeFile(`scripts/templates/action.js`, actionTemplate)
  helpers.writeFile(`scripts/templates/reducer.js`, reducerTemplate)
  // component script and templates
  helpers.writeFile(`scripts/component.js`, component) 
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate)
  helpers.writeFile(`scripts/templates/container.js`, containerTemplate)
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate)

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
  helpers.writeFile(`scripts/action.js`, action)
  helpers.writeFile(`scripts/templates/action.js`, actionTemplate);
  helpers.writeFile(`scripts/templates/reducer.js`, reducerTemplate);
  // component script and templates
  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`scripts/templates/container.js`, containerTemplate);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  // view script
  helpers.writeFile(`scripts/view.js`, view);

  // add scripts for action and component to package.json
  helpers.addScriptToNewPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToNewPackageJSON("action", "node scripts/action.js");
  helpers.addScriptToNewPackageJSON("view", "node scripts/view.js");
};

const packages = () => {
  if (!store.backend.backend) {
    helpers.addDevDependenciesToStore("webpack-dev-server")
  }
  helpers.addDevDependenciesToStore("react react-dom webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/preset-react style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader")
};

module.exports = { react };
