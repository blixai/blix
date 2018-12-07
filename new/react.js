const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const {createCommonFilesAndFolders} = require("./utils/createCommonFiles");
const {addLinter} = require('./utils/addLinter')
const {installReactTesting} = require("./utils/addReactTesting");
const {e2eSetup} = require("./utils/addEndToEndTesting");
const {newProjectInstructions} = require('./utils/newProjectInstructions')
const addAPIScript = require('./utils/addAPIScript')
const {createBackend} = require("./backend");
const store = require('./store')
const { loadFile } = helpers


// load common files
const babel = loadFile("frontend/babel/reactBabel");
const webpack = loadFile("frontend/webpack/react.js");
const webpackWithHotReloading = loadFile('frontend/webpack/reactWithHotReloading.js');
const postcssConfig = loadFile("frontend/postcss.config.js");

// load html file for projects without backends
const htmlFile = loadFile("frontend/other/index.html");
const cssFile = loadFile("frontend/other/App.css");

// load react files
const index = loadFile("frontend/react/index.js");
const app = loadFile("frontend/react/App.js");

// load react-router files
const reactRouterIndex = loadFile("frontend/react-router/index.js");
const appRouter = loadFile("frontend/react-router/Router.js");
const Navbar = loadFile("frontend/react-router/Navbar.js");
const NavbarCSS = loadFile("frontend/react-router/Navbar.css");
const HomeView = loadFile("frontend/react-router/Home.js");
const globalStyle = loadFile("frontend/react-router/global.css");

// load redux files
const reduxIndex = loadFile('frontend/redux/index.js')
const reduxAppContainer = loadFile('frontend/redux/AppContainer.js')
const reactRouterReduxIndex = loadFile("frontend/reactRouter-redux/index.js");
const configStore = loadFile("frontend/redux/configStore.js");
const rootReducer = loadFile("frontend/redux/rootReducer.js");
const ReduxHomeView = loadFile("frontend/redux/Home.js");

const NavbarContainer = loadFile("frontend/redux/NavbarContainer.js");

exports.react = () => {
  createCommonFilesAndFolders();

  // create react files
  helpers.mkdirSync(`dist`);
  helpers.mkdirSync(`src`);
  // A FOLDER TO HOLD FILES WITH RESOURCE FETCH CALLS TO ONE RESOURCE PER FILE (similar to controllers server side)
  helpers.mkdirSync(`src/api`);

  // build project specific contents based on type supplied from new/index.js
  this.createSrcContents();

  // create webpack postcssConfig and babelrc files
  helpers.writeFile(`postcss.config.js`, postcssConfig);
  helpers.writeFile(`.babelrc`, babel);

  this.createWebpack()

  // add config file and install linter
  addLinter()
  // install css lib for react 
  this.cssLibrary()
  // react testing setup
  installReactTesting();

  // e2e setup
  e2eSetup();

  // add scripts
  this.scripts();

  // add packages to store
  this.packages();

  // create backend
  if (store.backend && store.backend.backend) {
    store.backendType = "standard"
    createBackend()
    // createBackend("backend", store.serverTesting, store.database);
  } else {
    helpers.installAllPackages()
    newProjectInstructions()
  }
};

exports.cssLibrary = () => {
  if (store.reactCSS === 'material') {
    helpers.addDependenciesToStore('@material-ui/core', 'dev')
  } else if (store.reactCSS === 'bootstrap') {
    helpers.addDependenciesToStore('react-bootstrap', 'dev')
  } else if (store.reactCSS === 'styled') {
    helpers.addDependenciesToStore('styled-components', 'dev')
  }
}

exports.createSrcContents = () => {
  if (store.reactType === "react") {
    this.reactOnly();
  } else if (store.reactType === "react-router") {
    this.reactRouter();
  } else if (store.reactType === "redux") {
    this.redux()
  } else if (store.reactType === "reactRouter-redux") {
    this.reactRouterRedux();
  }
};

exports.reactOnly = () => {
  helpers.mkdirSync(`src/App`);
  helpers.writeFile(`src/index.js`, index);
  helpers.writeFile(`src/App/App.js`, app);
  helpers.writeFile(`src/App/App.css`, cssFile);
};

exports.reactRouter = () => {
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
  helpers.addDependenciesToStore("react-router-dom", 'dev');
};

exports.redux = () => {
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

  helpers.addDependenciesToStore("redux react-redux", 'dev')

}

exports.reactRouterRedux = () => {
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
  helpers.addDependenciesToStore("redux react-redux react-router-dom", 'dev');
};

exports.scripts = () => {
  if (!store.backend.backend) {
    helpers.addScriptToPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    helpers.writeFile(`index.html`, htmlFile);
  }
  helpers.addScriptToPackageJSON(
    "dev",
    "webpack --watch --mode='development'"
  );
  helpers.addScriptToPackageJSON("build", "webpack --mode='production'");
  // need to add scripts for creating containers actions
  if (store.reactType === "react") {
    this.reactScripts();
  } else if (store.reactType === "react-router") {
    this.reactRouterScripts();
  } else if (store.reactType === 'redux') {
    this.reduxScripts()
  } else if (store.reactType === "reactRouter-redux") {
    this.reactRouterReduxScripts();
  }

  addAPIScript()
};

exports.reactScripts = () => {
  let component = loadFile("scripts/frontend/react/component.js")
  let statefulComponentTemplate = loadFile('scripts/frontend/react/templates/statefulComponent.js')
  let statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")

  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
};

exports.reactRouterScripts = () => {
  let component = loadFile("scripts/frontend/react-router/component.js")
  let statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")
  let statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
  let view = loadFile('scripts/frontend/react-router/view.js')

  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`scripts/view.js`, view);
  // add scripts to package.json
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToPackageJSON("view", "node scripts/view.js");
};

exports.reduxScripts = () => {
  let action = loadFile("scripts/frontend/redux/action.js")
  let actionTemplate = loadFile("scripts/frontend/redux/templates/action.js")
  let reducerTemplate = loadFile("scripts/frontend/redux/templates/reducer.js")
  let component = loadFile("scripts/frontend/redux/component.js")
  let statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
  let containerTemplate = loadFile("scripts/frontend/redux/templates/container.js")
  let statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")

  // action script and templates
  helpers.writeFile(`scripts/action.js`, action)
  helpers.writeFile(`scripts/templates/action.js`, actionTemplate)
  helpers.writeFile(`scripts/templates/reducer.js`, reducerTemplate)
  // component script and templates
  helpers.writeFile(`scripts/component.js`, component)
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate)
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate)
  helpers.writeFile(`scripts/templates/container.js`, containerTemplate)

  // add scripts for action and component to package.json
  helpers.addScriptToPackageJSON('component', 'node scripts/component.js')
  helpers.addScriptToPackageJSON('action', 'node scripts/action.js')
}

exports.reactRouterReduxScripts = () => {
  let action = loadFile("scripts/frontend/reactRouter-redux/action.js")
  let actionTemplate = loadFile("scripts/frontend/redux/templates/action.js")
  let reducerTemplate = loadFile("scripts/frontend/redux/templates/reducer.js")
  let component = loadFile("scripts/frontend/reactRouter-redux/component.js")
  let statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
  let containerTemplate = loadFile("scripts/frontend/redux/templates/container.js")
  let statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")
  let view = loadFile('scripts/frontend/reactRouter-redux/view.js')
  // action script and templates
  helpers.writeFile(`scripts/action.js`, action)
  helpers.writeFile(`scripts/templates/action.js`, actionTemplate);
  helpers.writeFile(`scripts/templates/reducer.js`, reducerTemplate);
  // component script and templates
  helpers.writeFile(`scripts/component.js`, component);
  helpers.writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  helpers.writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  helpers.writeFile(`scripts/templates/container.js`, containerTemplate);
  // view script
  helpers.writeFile(`scripts/view.js`, view);

  // add scripts for action and component to package.json
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  helpers.addScriptToPackageJSON("action", "node scripts/action.js");
  helpers.addScriptToPackageJSON("view", "node scripts/view.js");
};

exports.packages = () => {
  if (!store.backend.backend) {
    helpers.addDependenciesToStore("webpack-dev-server", 'dev')
  }
  helpers.addDependenciesToStore("react react-dom webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime @babel/runtime style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader", 'dev')
};

exports.createWebpack = () => {
  if (store.backend.backend) {
    helpers.writeFile(`webpack.config.js`, webpackWithHotReloading);
    let hotReloadIndex = `\nif (module.hot) {\n\tconsole.clear()\n\tmodule.hot.accept();\n}`
    helpers.appendFile(`src/index.js`, hotReloadIndex)
  } else {
    helpers.writeFile(`webpack.config.js`, webpack);
  }
}
