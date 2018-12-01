const helpers = require('../helpers')
const fs = require("fs");
const path = require("path");
const { createCommonFilesAndFolders } = require("./utils/createCommonFiles");
const addAPIScript = require('./utils/addAPIScript')
const { createBackend } = require("./backend");
const store = require('./store')
const { e2eSetup } = require("./utils/addEndToEndTesting");
const { newProjectInstructions } = require('./utils/newProjectInstructions')

const loadFile = filePath => {
    return fs.readFileSync(path.resolve(__dirname, './files/' + filePath), "utf8");
};

const postcssConfig = loadFile('frontend/postcss.config.js')
const babel = loadFile('frontend/babel/vuebabel')


exports.vue = () => {
    createCommonFilesAndFolders()

    helpers.mkdirSync('dist')
    helpers.mkdirSync('src')
    helpers.mkdirSync('src/api')

    this.createSrcContents()

    helpers.writeFile(`postcss.config.js`, postcssConfig);
    helpers.writeFile(`.babelrc`, babel);

    this.createWebpack()

    e2eSetup()


    this.scripts()

    this.packages()

    if (store.backend && store.backend.backend) {
        store.backendType = "standard"
        createBackend()
      } else {
        helpers.installAllPackages()
        newProjectInstructions()
      }
}

exports.createSrcContents = () => {
    let type = store.vueType
    if (type === 'vue') {
        this.vueOnly()
    } else if (type === 'vue-router') {
        this.vueRouter()
    } else if (type === 'vuex') {
        this.vuex()
    } else if (type === 'vueRouter-vuex') {
        this.vueRouterVuex()
    }
}

exports.vueOnly = () => {
    let main = loadFile('frontend/vue/main.js')
    let App = loadFile('frontend/vue/App.vue')

    helpers.writeFile('src/main.js', main)
    helpers.writeFile('src/App.vue', App)
    helpers.mkdirSync('src/components')
}

exports.vueRouter = () => {
    let main = loadFile('frontend/vue-router/main.js')
    let App = loadFile('frontend/vue-router/App.vue')
    let router = loadFile('frontend/vue-router/router.js')
    let Home = loadFile('frontend/vue-router/Home.vue')
    let Navbar = loadFile('frontend/vue-router/Navbar.vue')

    helpers.writeFile('src/main.js', main)
    helpers.writeFile('src/App.vue', App)
    helpers.writeFile('src/router.js', router)
    helpers.mkdirSync('src/views')
    helpers.writeFile('src/views/Home.vue', Home)
    helpers.mkdirSync('src/components')
    helpers.writeFile('src/components/Navbar.vue', Navbar)
    
    helpers.addDependenciesToStore('vue-router', 'dev')
}

exports.vuex = () => {
    let main = loadFile('frontend/vuex/main.js')
    let App = loadFile('frontend/vue/App.vue')
    let store = loadFile('frontend/vuex/store.js')

    helpers.writeFile('src/main.js', main)
    helpers.writeFile('src/App.vue', App)
    helpers.mkdirSync('src/store')
    helpers.writeFile('src/store/index.js', store)
    helpers.mkdirSync('src/components')

    helpers.addDependenciesToStore('vuex', 'dev')
}

exports.vueRouterVuex = () => {
    let main = loadFile('frontend/vueRouter-vuex/main.js')
    let App = loadFile('frontend/vue-router/App.vue')
    let router = loadFile('frontend/vue-router/router.js')
    let Home = loadFile('frontend/vue-router/Home.vue')
    let Navbar = loadFile('frontend/vue-router/Navbar.vue')
    let store = loadFile('frontend/vuex/store.js')

    helpers.writeFile('src/main.js', main)
    helpers.writeFile('src/App.vue', App)
    helpers.writeFile('src/router.js', router)
    helpers.mkdirSync('src/store')
    helpers.writeFile('src/store/index.js', store)
    helpers.mkdirSync('src/views')
    helpers.writeFile('src/views/Home.vue', Home)
    helpers.mkdirSync('src/components')
    helpers.writeFile('src/components/Navbar.vue', Navbar)
    
    helpers.addDependenciesToStore('vue-router vuex', 'dev')
}

exports.scripts = () => {
    if (!store.backend.backend) {
        let htmlFile = loadFile('frontend/other/index.html')
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

    addAPIScript()
}

exports.vueScripts = () => {

}

exports.vueRouterScripts = () => {
    
}

exports.vuexScripts = () => {
    
}

exports.vueRouterVuexScripts = () => {
    
}

exports.packages = () => {
    if (!store.backend.backend) {
        helpers.addDependenciesToStore("webpack-dev-server", 'dev')
    }
    helpers.addDependenciesToStore("vue vue-loader vue-style-loader vue-template-compiler webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime style-loader cssnano postcss postcss-preset-env postcss-import postcss-loader", 'dev')
}

exports.createWebpack = () => {
    let webpack = loadFile('frontend/webpack/vue.js')
    let webpackWithHotReloading = loadFile('frontend/webpack/vue_webpackWithHotReloading.js')

    if (store.backend.backend) {
      helpers.writeFile(`webpack.config.js`, webpackWithHotReloading);
      let hotReloadIndex = `\n\nif (module.hot) {\n\tconsole.clear()\n\tmodule.hot.accept();\n}`
      helpers.appendFile(`src/main.js`, hotReloadIndex)
    } else {
      helpers.writeFile(`webpack.config.js`, webpack);
    }
  }
