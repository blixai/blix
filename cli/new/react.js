const {createCommonFilesAndFolders} = require("./utils/createCommonFiles");
const {addLinter} = require('./utils/addLinter')
const {installReactTesting} = require("./utils/addReactTesting");
const {e2eSetup} = require("./utils/addEndToEndTesting");
const {newProjectInstructions} = require('./utils/newProjectInstructions')
const addAPIScript = require('./utils/addAPIScript')
const {createBackend} = require("./backend");
const { 
  loadFile,
  store,
  mkdirSync,
  writeFile,
  addDependenciesToStore,
  addScriptToPackageJSON,
  appendFile,
  installAllPackages
} = require('../../index')


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
  mkdirSync(`dist`);
  mkdirSync(`src`);
  // A FOLDER TO HOLD FILES WITH RESOURCE FETCH CALLS TO ONE RESOURCE PER FILE (similar to controllers server side)
  mkdirSync(`src/api`);

  // build project specific contents based on type supplied from new/index.js
  this.createSrcContents();

  // create webpack postcssConfig and babelrc files
  writeFile(`postcss.config.js`, postcssConfig);
  writeFile(`.babelrc`, babel);

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
    installAllPackages()
    newProjectInstructions()
  }
};

exports.cssLibrary = () => {
  if (store.reactCSS === 'material') {
    addDependenciesToStore('@material-ui/core', 'dev')
  } else if (store.reactCSS === 'bootstrap') {
    addDependenciesToStore('react-bootstrap', 'dev')
  } else if (store.reactCSS === 'styled') {
    addDependenciesToStore('styled-components', 'dev')
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
  mkdirSync(`src/App`);
  writeFile(`src/index.js`, index);
  writeFile(`src/App/App.js`, app);
  writeFile(`src/App/App.css`, cssFile);
};

exports.reactRouter = () => {
  writeFile(`src/index.js`, reactRouterIndex);
  writeFile(`src/Router.js`, appRouter);

  mkdirSync(`src/components`);
  mkdirSync(`src/components/Navbar`);
  writeFile(`src/components/Navbar/Navbar.js`, Navbar);
  writeFile(`src/components/Navbar/Navbar.css`, NavbarCSS);
  mkdirSync(`src/views`);
  writeFile(`src/views/Home.js`, HomeView);
  // styles folder
  mkdirSync(`src/styles`);
  writeFile(`src/styles/global.css`, globalStyle);
  // install react-router-dom for src/index.js file
  addDependenciesToStore("react-router-dom", 'dev');
};

exports.redux = () => {
  writeFile(`src/index.js`, reduxIndex)
  mkdirSync(`src/App`)
  writeFile(`src/App/App.js`, app)
  writeFile(`src/App/AppContainer.js`, reduxAppContainer)
  writeFile(`src/App/App.css`, cssFile)

  mkdirSync(`src/actions`)
  writeFile(`src/actions/index.js`, "")

  mkdirSync(`src/reducers`)
  writeFile(`src/reducers/rootReducer.js`, rootReducer);
  writeFile(`src/configStore.js`, configStore);

  addDependenciesToStore("redux react-redux", 'dev')

}

exports.reactRouterRedux = () => {
  writeFile(`src/index.js`, reactRouterReduxIndex);
  writeFile(`src/Router.js`, appRouter);
  // components folder, every component will have a folder with associated css, tests, and/or container for that component
  mkdirSync(`src/components`);
  mkdirSync(`src/components/Navbar`);
  writeFile(`src/components/Navbar/Navbar.js`, Navbar);
  writeFile(
    `src/components/Navbar/NavbarContainer.js`,
    NavbarContainer
  );
  writeFile(`src/components/Navbar/Navbar.css`, NavbarCSS);
  // views folder
  mkdirSync(`src/views`);
  writeFile(`src/views/Home.js`, ReduxHomeView);
  // styles folder for views
  mkdirSync(`src/styles`);
  writeFile(`src/styles/global.css`, globalStyle);

  // need to make actions folder and store file and configure store and reducers folder with rootReducer.js
  mkdirSync(`src/actions`);
  writeFile(`src/actions/index.js`, "");
  mkdirSync(`src/reducers`);
  writeFile(`src/reducers/rootReducer.js`, rootReducer);
  writeFile(`src/configStore.js`, configStore);
  //install react-router-dom and other redux specific libs
  addDependenciesToStore("redux react-redux react-router-dom", 'dev');
};

exports.scripts = () => {
  if (!store.backend.backend) {
    addScriptToPackageJSON(
      "start",
      "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
    );
    writeFile(`index.html`, htmlFile);
  }
  addScriptToPackageJSON(
    "dev",
    "webpack --watch --mode='development'"
  );
  addScriptToPackageJSON("build", "webpack --mode='production'");
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

  writeFile(`scripts/component.js`, component);
  writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  addScriptToPackageJSON("component", "node scripts/component.js");
};

exports.reactRouterScripts = () => {
  let component = loadFile("scripts/frontend/react-router/component.js")
  let statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")
  let statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
  let view = loadFile('scripts/frontend/react-router/view.js')

  writeFile(`scripts/component.js`, component);
  writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  writeFile(`scripts/view.js`, view);
  // add scripts to package.json
  addScriptToPackageJSON("component", "node scripts/component.js");
  addScriptToPackageJSON("view", "node scripts/view.js");
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
  writeFile(`scripts/action.js`, action)
  writeFile(`scripts/templates/action.js`, actionTemplate)
  writeFile(`scripts/templates/reducer.js`, reducerTemplate)
  // component script and templates
  writeFile(`scripts/component.js`, component)
  writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate)
  writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate)
  writeFile(`scripts/templates/container.js`, containerTemplate)

  // add scripts for action and component to package.json
  addScriptToPackageJSON('component', 'node scripts/component.js')
  addScriptToPackageJSON('action', 'node scripts/action.js')
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
  writeFile(`scripts/action.js`, action)
  writeFile(`scripts/templates/action.js`, actionTemplate);
  writeFile(`scripts/templates/reducer.js`, reducerTemplate);
  // component script and templates
  writeFile(`scripts/component.js`, component);
  writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
  writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
  writeFile(`scripts/templates/container.js`, containerTemplate);
  // view script
  writeFile(`scripts/view.js`, view);

  // add scripts for action and component to package.json
  addScriptToPackageJSON("component", "node scripts/component.js");
  addScriptToPackageJSON("action", "node scripts/action.js");
  addScriptToPackageJSON("view", "node scripts/view.js");
};

exports.packages = () => {
  if (!store.backend.backend) {
    addDependenciesToStore("webpack-dev-server", 'dev')
  }
  addDependenciesToStore("react react-dom webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime @babel/runtime style-loader sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-preset-env postcss-import postcss-loader", 'dev')
};

exports.createWebpack = () => {
  if (store.backend.backend) {
    writeFile(`webpack.config.js`, webpackWithHotReloading);
    let hotReloadIndex = `\nif (module.hot) {\n\tconsole.clear()\n\tmodule.hot.accept();\n}`
    appendFile(`src/index.js`, hotReloadIndex)
  } else {
    writeFile(`webpack.config.js`, webpack);
  }
}
