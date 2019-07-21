let fs = require('fs')
let path = require('path')
let inquirer = require('inquirer')
let prompt = inquirer.prompt
let { addProjectInstructions } = require('../addProjectInstructions')
const { 
    loadFile,
    store,
    yarn,
    installDependencies,
    writeFile,
    mkdirSync,
    checkIfScriptIsTaken,
    checkScriptsFolderExist,
    addScriptToPackageJSON,
    moveAllFilesInDir,
    rename
} = require('@blix/core')


let continuePrompt = {
    type: 'confirm',
    message: 'Do you want to continue: ',
    name: 'confirm'
}

exports.addReactRouter = async () => {
    console.clear()
    console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
    let answer = await prompt([continuePrompt])
    answer = answer.confirm
    if (answer) {
        this.projectType()
    }
}

exports.projectType = async () => {
    await yarn()
    installDependencies('react-router-dom', 'dev')
    // make sure there is a src folder
    if (!fs.existsSync('./src')) {
        console.error('No src/ directory found. Unable to add React-Router.')
        return
    } else if (fs.existsSync('./src/views')) {
        console.error('A src/views folder already exists.')
        return
    } else if (fs.existsSync('./src/components')) {
        this.createView('unknown')
        return
    }

    // check if created by blix with redux, blix basic react, or create-react-app
    if (fs.existsSync('./src/App/AppContainer.js')) {
        this.blixRedux()
    } else if (fs.existsSync('./src/App/App.js')) {
        this.blixReact()
    } else if (fs.existsSync('./src/App.js') && !fs.existsSync('./src/components')) {
        this.createReactApp()
    }
}

exports.createView = type => {
    mkdirSync('src/views')

    if (type === 'redux') {
        let homeView = loadFile('frontend/react-router/HomeAppContainerView.js')
        writeFile('src/views/Home.js', homeView)
    } else if (type === 'unknown') {
        let homeView = fs.readFileSync(path.resolve(__dirname, './HomeViewBasic.js'), 'utf8')
        writeFile('src/views/Home.js', homeView)
    } else {
        let homeView = loadFile('frontend/react-router/HomeAppView.js')
        writeFile('src/views/Home.js', homeView)
    }

    let AppRouter = loadFile('frontend/react-router/Router.js')
    writeFile('src/Router.js', AppRouter)

    if (type === 'redux') {
        let index = loadFile('frontend/reactRouter-redux/index.js')
        writeFile('src/index.js', index)
    } else {
        let index = loadFile('frontend/react-router/index.js')
        writeFile('src/index.js', index)
    }

    // scripts
    checkScriptsFolderExist()
    // if no component script/templates add them
    if (!checkIfScriptIsTaken('component')) {
        if (type !== 'unknown') {
            let stateful = loadFile('scripts/frontend/react/templates/statefulComponent.js')
            let stateless = loadFile('scripts/frontend/react/templates/statelessComponent.js')
    
            writeFile('scripts/templates/statelessComponent.js', stateless)
            writeFile('scripts/templates/statefulComponent.js', stateful)

            if (type === 'redux') {
                let componentScript = loadFile('scripts/frontend/reactRouter-redux/component.js')
                writeFile('scripts/component.js', componentScript)
            } else {
               let componentScript = loadFile('scripts/frontend/react-router/component.js') 
               writeFile('scripts/component.js', componentScript)
            }

            addScriptToPackageJSON('component', 'node scripts/component.js')
        }
    } else {
        if (type === 'redux') {
            let componentScript = loadFile('scripts/frontend/reactRouter-redux/component.js')
            writeFile('scripts/component.js', componentScript)
        } else {
           let componentScript = loadFile('scripts/frontend/react-router/component.js') 
           writeFile('scripts/component.js', componentScript) 
        }
    }

    // add view script
    if (type === 'redux') {
        // redux type script
        let viewScript = loadFile('scripts/frontend/reactRouter-redux/view.js')
        writeFile('scripts/view.js', viewScript)
        addScriptToPackageJSON('view', 'node scripts/view.js')
    } else if (type !== 'unknown') {
        // need to check if components script and templates already exist
        let viewScript = loadFile('scripts/frontend/react-router/view.js')
        writeFile('scripts/view.js', viewScript)
        addScriptToPackageJSON('view', 'node scripts/view.js')
    }

    // redux action script update
    if (type === 'redux' && checkIfScriptIsTaken('action')) {
        let newActionScript = loadFile('scripts/frontend/reactRouter-redux/action.js')
        writeFile('scripts/action.js', newActionScript)
    }

    if (type === 'redux') {
        store.reactType = 'reactRouter-redux'
    } else if (type !== 'unknown') {
        store.reactType = 'react-router'
    }
    addProjectInstructions()
}

exports.blixRedux = () => {
    mkdirSync('src/components')
    mkdirSync('src/components/App')
    moveAllFilesInDir('./src/App', './src/components/App')

    this.createView('redux')
}

exports.blixReact = () => {
    mkdirSync('src/components')
    mkdirSync('src/components/App')
    moveAllFilesInDir('./src/App', './src/components/App')

    this.createView()
}

exports.createReactApp = () => {
    mkdirSync('src/components')
    mkdirSync('src/components/App')

    rename('./src/App.js', './src/components/App/App.js')
    if (fs.existsSync('./src/App.css')) {
        rename('./src/App.css', './src/components/App/App.css')
    }
    if (fs.existsSync('./src/logo.svg')) {
        rename('./src/logo.svg', './src/components/App/logo.svg')
    }
    if (fs.existsSync('./src/App.test.js')) {
        rename('./src/App.test.js', './src/components/App/App.test.js')
    }
    this.createView()
}
