const { createCommonFilesAndFolders } = require("./utils/createCommonFiles");
const addAPIScript = require('./utils/addAPIScript')
const { createBackend } = require("./backend");
const { e2eSetup } = require("./utils/addEndToEndTesting");
const { newProjectInstructions } = require('./utils/newProjectInstructions')
const { 
    loadFile,
    store,
    mkdirSync,
    writeFile,
    addDependenciesToStore,
    addScriptToPackageJSON,
    installAllPackages,
    appendFile
} = require('../../blix')


exports.vue = () => {
    const postcssConfig = loadFile('frontend/postcss.config.js')
    const babel = loadFile('frontend/babel/vuebabel')
    
    createCommonFilesAndFolders()

    mkdirSync('dist')
    mkdirSync('src')
    mkdirSync('src/api')
    mkdirSync('src/mixins')

    this.createSrcContents()

    writeFile(`postcss.config.js`, postcssConfig);
    writeFile(`.babelrc`, babel);
    
    this.cssLibrary()

    this.createWebpack()

    e2eSetup()


    this.scripts()

    this.packages()

    if (store.backend && store.backend.backend) {
        store.backendType = "standard"
        createBackend()
      } else {
        installAllPackages()
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

    writeFile('src/main.js', main)
    writeFile('src/App.vue', App)
    mkdirSync('src/components')
}

exports.vueRouter = () => {
    let main = loadFile('frontend/vue-router/main.js')
    let App = loadFile('frontend/vue-router/App.vue')
    let router = loadFile('frontend/vue-router/router.js')
    let Home = loadFile('frontend/vue-router/Home.vue')
    let Navbar = loadFile('frontend/vue-router/Navbar.vue')

    writeFile('src/main.js', main)
    writeFile('src/App.vue', App)
    writeFile('src/router.js', router)
    mkdirSync('src/views')
    writeFile('src/views/Home.vue', Home)
    mkdirSync('src/components')
    writeFile('src/components/Navbar.vue', Navbar)
    
    addDependenciesToStore('vue-router', 'dev')
}

exports.vuex = () => {
    let main = loadFile('frontend/vuex/main.js')
    let App = loadFile('frontend/vue/App.vue')
    let store = loadFile('frontend/vuex/store.js')

    writeFile('src/main.js', main)
    writeFile('src/App.vue', App)
    mkdirSync('src/store')
    writeFile('src/store/index.js', store)
    mkdirSync('src/components')

    addDependenciesToStore('vuex', 'dev')
}

exports.vueRouterVuex = () => {
    let main = loadFile('frontend/vueRouter-vuex/main.js')
    let App = loadFile('frontend/vue-router/App.vue')
    let router = loadFile('frontend/vue-router/router.js')
    let Home = loadFile('frontend/vue-router/Home.vue')
    let Navbar = loadFile('frontend/vue-router/Navbar.vue')
    let store = loadFile('frontend/vuex/store.js')

    writeFile('src/main.js', main)
    writeFile('src/App.vue', App)
    writeFile('src/router.js', router)
    mkdirSync('src/store')
    writeFile('src/store/index.js', store)
    mkdirSync('src/views')
    writeFile('src/views/Home.vue', Home)
    mkdirSync('src/components')
    writeFile('src/components/Navbar.vue', Navbar)
    
    addDependenciesToStore('vue-router vuex', 'dev')
}

exports.scripts = () => {
    if (!store.backend.backend) {
        let htmlFile = loadFile('frontend/other/index.html')
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

    if (store.vueType === 'vue') {
        this.vueScripts()
    }

    addAPIScript()
}

exports.vueScripts = () => {
    let component = loadFile('scripts/frontend/vue/component.js')
    let template = loadFile('scripts/frontend/vue/templates/component.vue')
    
    writeFile('scripts/component.js', component)
    writeFile('scripts/templates/component.vue', template)
    addScriptToPackageJSON('component', 'node scripts/component.js')
}

exports.vueRouterScripts = () => {
    
}

exports.vuexScripts = () => {
    
}

exports.vueRouterVuexScripts = () => {
    
}

exports.cssLibrary = () => {
    if (store.vueCSS === 'vuetify') {
        addDependenciesToStore('vuetify', 'dev')
    } else if (store.vueCSS === 'element') {
        addDependenciesToStore('element-ui', 'dev')
    } else if (store.vueCSS === 'bootstrap') {
        addDependenciesToStore('bootstrap-vue bootstrap', 'dev')
    }
}

exports.packages = () => {
    if (!store.backend.backend) {
        addDependenciesToStore("webpack-dev-server", 'dev')
    }
    addDependenciesToStore("vue vue-loader vue-style-loader vue-template-compiler webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime style-loader cssnano postcss postcss-preset-env postcss-import postcss-loader blix@next", 'dev')
}

exports.createWebpack = () => {
    let webpack = loadFile('frontend/webpack/vue.js')
    let webpackWithHotReloading = loadFile('frontend/webpack/vue_webpackWithHotReloading.js')

    if (store.backend.backend) {
      writeFile(`webpack.config.js`, webpackWithHotReloading);
      let hotReloadIndex = `\n\nif (module.hot) {\n\tconsole.clear()\n\tmodule.hot.accept();\n}`
      appendFile(`src/main.js`, hotReloadIndex)
    } else {
      writeFile(`webpack.config.js`, webpack);
    }
  }
