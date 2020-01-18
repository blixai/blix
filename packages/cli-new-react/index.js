const {
    addAPIScript,
    addLinter,
    createCommonFilesAndFolders,
    e2eSetup,
    installReactTesting,
    newProjectInstructions
} = require('@blixai/cli-new-utils')
const { createBackend } = require("@blixai/cli-new-backend");
const {
    loadFile,
    store,
    mkdirSync,
    writeFile,
    addDependenciesToStore,
    addScriptToPackageJSON,
    appendFile,
    installAllPackages,
    clearConsole,
    logTaskStatus,
    Task,
    createMultipleFolders,
    createFilesAndFolders
} = require('@blixai/core')


// load css file
const cssFile = loadFile("frontend/other/App.css");

// load common react files
const app = loadFile("frontend/react/App.js");

// load common react-router files
const appRouter = loadFile("frontend/react-router/Router.js");
const Navbar = loadFile("frontend/react-router/Navbar.js");
const NavbarCSS = loadFile("frontend/react-router/Navbar.css");
const globalStyle = loadFile("frontend/react-router/global.css");

// load common redux files
const configStore = loadFile("frontend/redux/configStore.js");
const rootReducer = loadFile("frontend/redux/rootReducer.js");


exports.react = () => {
    clearConsole()

    createCommonFilesAndFolders();

    // create react files
    createMultipleFolders([
        'dist',
        'src',
        'src/api'
    ])

    // build project specific contents based on type supplied from new/index.js
    this.createSrcContents();

    // create webpack postcssConfig and babelrc files
    writeFile(`postcss.config.js`, loadFile("frontend/postcss.config.js"));
    writeFile(`.babelrc`, loadFile("frontend/babel/reactBabel"));

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
    } else if (!store.skipInstallation) {
        installAllPackages()
            .then(() => newProjectInstructions())
            .catch((err) => {
                // TODO - fallback/logging
            });
    } else {
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
    const index = loadFile("frontend/react/index.js");

    mkdirSync(`src/App`);
    writeFile(`src/index.js`, index);
    writeFile(`src/App/App.js`, app);
    writeFile(`src/App/App.css`, cssFile);
};

exports.reactRouter = () => {
    const reactRouterIndex = loadFile("frontend/react-router/index.js");
    const HomeView = loadFile("frontend/react-router/Home.js");
    createFilesAndFolders(``, {
        src: {

            'index.js': reactRouterIndex,
            'Router.js': appRouter,

            components: {
                Navbar: {
                    'Navbar.js': Navbar,
                    'Navbar.css': NavbarCSS
                }
            },

            views: {
                'Home.js': HomeView
            },

            styles: {
                'global.css': globalStyle
            }
        }
    })

    // install react-router-dom for src/index.js file
    addDependenciesToStore("react-router-dom", 'dev');
};

exports.redux = () => {
    const reduxIndex = loadFile('frontend/redux/index.js')
    const reduxAppContainer = loadFile('frontend/redux/AppContainer.js')

    createFilesAndFolders('src', {
        'index.js': reduxIndex,
        App: {
            'App.js': app,
            'AppContainer.js': reduxAppContainer,
            'App.css': cssFile
        },
        actions: {
            'index.js': ''
        },
        reducers: {
            'rootReducer.js': rootReducer,
        },
        'configStore.js': configStore
    })

    addDependenciesToStore("redux react-redux", 'dev')
}

exports.reactRouterRedux = () => {
    const NavbarContainer = loadFile("frontend/redux/NavbarContainer.js");
    const ReduxHomeView = loadFile("frontend/redux/Home.js");
    const reactRouterReduxIndex = loadFile("frontend/reactRouter-redux/index.js")

    createFilesAndFolders('src', {
        'index.js': reactRouterReduxIndex,
        'Router.js': appRouter,
        components: {
            Navbar: {
                'Navbar.js': Navbar,
                'NavbarContainer.js': NavbarContainer,
                'Navbar.css': NavbarCSS
            }
        },
        views: {
            'Home.js': ReduxHomeView
        },
        styles: {
            'global.css': globalStyle
        },
        actions: {
            'index.js': ""
        },
        reducers: {
            'rootReducer.js': rootReducer
        },
        'configStore.js': configStore
    })

    //install react-router-dom and other redux specific libs
    addDependenciesToStore("redux react-redux react-router-dom", 'dev');
};

exports.scripts = () => {
    let scriptsTask = new Task('Create Blix scripts for project!', '✨')
    scriptsTask.start()


    if (!store.backend.backend) {
        addScriptToPackageJSON(
            "start",
            "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'"
        );
        writeFile(`index.html`, loadFile("frontend/other/index.html"));
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

    scriptsTask.finished()
};

exports.reactScripts = () => {
    const component = loadFile("scripts/frontend/react/component.js")
    const statefulComponentTemplate = loadFile('scripts/frontend/react/templates/statefulComponent.js')
    const statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")

    writeFile(`scripts/component.js`, component);
    writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
    writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
    addScriptToPackageJSON("component", "node scripts/component.js");
};

exports.reactRouterScripts = () => {
    const component = loadFile("scripts/frontend/react-router/component.js")
    const statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")
    const statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
    const view = loadFile('scripts/frontend/react-router/view.js')

    writeFile(`scripts/component.js`, component);
    writeFile(`scripts/templates/statefulComponent.js`, statefulComponentTemplate);
    writeFile(`scripts/templates/statelessComponent.js`, statelessComponentTemplate);
    writeFile(`scripts/view.js`, view);
    // add scripts to package.json
    addScriptToPackageJSON("component", "node scripts/component.js");
    addScriptToPackageJSON("view", "node scripts/view.js");
};

exports.reduxScripts = () => {
    const action = loadFile("scripts/frontend/redux/action.js")
    const actionTemplate = loadFile("scripts/frontend/redux/templates/action.js")
    const reducerTemplate = loadFile("scripts/frontend/redux/templates/reducer.js")
    const component = loadFile("scripts/frontend/redux/component.js")
    const statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
    const containerTemplate = loadFile("scripts/frontend/redux/templates/container.js")
    const statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")

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
    const action = loadFile("scripts/frontend/reactRouter-redux/action.js")
    const actionTemplate = loadFile("scripts/frontend/redux/templates/action.js")
    const reducerTemplate = loadFile("scripts/frontend/redux/templates/reducer.js")
    const component = loadFile("scripts/frontend/reactRouter-redux/component.js")
    const statelessComponentTemplate = loadFile("scripts/frontend/react/templates/statelessComponent.js")
    const containerTemplate = loadFile("scripts/frontend/redux/templates/container.js")
    const statefulComponentTemplate = loadFile("scripts/frontend/react/templates/statefulComponent.js")
    const view = loadFile('scripts/frontend/reactRouter-redux/view.js')

    createFilesAndFolders('scripts', {
        'action.js': action,
        templates: {
            'action.js': actionTemplate,
            'reducer.js': reducerTemplate
        },
        'component.js': component,
        templates: {
            'statefulComponent.js': statefulComponentTemplate,
            'statelessComponent.js': statelessComponentTemplate,
            'container.js': containerTemplate
        },
        'view.js': view
    })

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
    const webpack = loadFile("frontend/webpack/react.js");
    const webpackWithHotReloading = loadFile('frontend/webpack/reactWithHotReloading.js');

    if (store.backend.backend) {
        writeFile(`webpack.config.js`, webpackWithHotReloading);
        let hotReloadIndex = `\nif (module.hot) {\n\tconsole.clear()\n\tmodule.hot.accept();\n}`
        appendFile(`src/index.js`, hotReloadIndex)
    } else {
        writeFile(`webpack.config.js`, webpack);
    }

    logTaskStatus('Created webpack config', 'success')
}
