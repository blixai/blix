let fs = require('fs')
let path = require('path')
let helpers = require('../../helpers')
let inquirer = require('inquirer')
let prompt = inquirer.prompt
let addProjectInstructions = require('../addProjectInstructions')
let store = require('../../new/store')

let loadFile = filePath => {
    let root = '../../new/files/'
    return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

let continuePrompt = {
    type: 'confirm',
    message: 'Do you want to continue: ',
    name: 'confirm'
}

let addReactRouter = async () => {
    console.clear()
    console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
    let answer = await prompt([continuePrompt])
    answer = answer.confirm
    if (answer) {
        projectType()
    }
}

module.exports = addReactRouter

let projectType = async () => {
    await helpers.yarn()
    helpers.installDevDependenciesToExistingProject('react-router-dom')
    // make sure there is a src folder
    if (!fs.existsSync('./src')) {
        console.error('No src/ directory found. Unable to add React-Router.')
        return
    } else if (fs.existsSync('./src/views')) {
        console.error('A src/views folder already exists.')
        return
    } else if (fs.existsSync('./src/components')) {
        createView('unknown')
        return
    }

    // check if created by blix with redux, blix basic react, or create-react-app
    if (fs.existsSync('./src/App/AppContainer.js')) {
        blixRedux()
    } else if (fs.existsSync('./src/App/App.js')) {
        blixReact()
    } else if (fs.existsSync('./src/App.js') && !fs.existsSync('./src/components')) {
        createReactApp()
    }
}

let createView = type => {
    helpers.mkdirSync('src/views')

    if (type === 'redux') {
        let homeView = loadFile('frontend/react-router/HomeAppContainerView.js')
        helpers.writeFile('src/views/Home.js', homeView)
    } else if (type === 'unknown') {
        let homeView = fs.readFileSync(path.resolve(__dirname, './HomeViewBasic.js'), 'utf8')
        helpers.writeFile('src/views/Home.js', homeView)
    } else {
        let homeView = loadFile('frontend/react-router/HomeAppView.js')
        helpers.writeFile('src/views/Home.js', homeView)
    }

    let AppRouter = loadFile('frontend/react-router/Router.js')
    helpers.writeFile('src/Router.js', AppRouter)

    if (type === 'redux') {
        let index = loadFile('frontend/reactRouter-redux/index.js')
        helpers.writeFile('src/index.js', index)
    } else {
        let index = loadFile('frontend/react-router/index.js')
        helpers.writeFile('src/index.js', index)
    }

    // scripts
    helpers.checkScriptsFolderExist()
    // if no component script/templates add them
    if (!helpers.checkIfScriptIsTaken('component')) {
        if (type !== 'unknown') {
            let stateful = loadFile('scripts/frontend/react/templates/statefulComponent.js')
            let stateless = loadFile('scripts/frontend/react/templates/statelessComponent.js')
    
            helpers.writeFile('scripts/templates/statelessComponent.js', stateless)
            helpers.writeFile('scripts/templates/statefulComponent.js', stateful)

            if (type === 'redux') {
                let componentScript = loadFile('scripts/frontend/reactRouter-redux/component.js')
                helpers.writeFile('scripts/component.js', componentScript)
            } else {
               let componentScript = loadFile('scripts/frontend/react-router/component.js') 
               helpers.writeFile('scripts/component.js', componentScript)
            }

            helpers.addScript('component', 'node scripts/component.js')
        }
    } else {
        if (type === 'redux') {
            let componentScript = loadFile('scripts/frontend/reactRouter-redux/component.js')
            helpers.writeFile('scripts/component.js', componentScript)
        } else {
           let componentScript = loadFile('scripts/frontend/react-router/component.js') 
           helpers.writeFile('scripts/component.js', componentScript) 
        }
    }

    // add view script
    if (type === 'redux') {
        // redux type script
        let viewScript = loadFile('scripts/frontend/reactRouter-redux/view.js')
        helpers.writeFile('scripts/view.js', viewScript)
        helpers.addScript('view', 'node scripts/view.js')
    } else if (type !== 'unknown') {
        // need to check if components script and templates already exist
        let viewScript = loadFile('scripts/frontend/react-router/view.js')
        helpers.writeFile('scripts/view.js', viewScript)
        helpers.addScript('view', 'node scripts/view.js')
    }

    // redux action script update
    if (type === 'redux' && helpers.checkIfScriptIsTaken('action')) {
        let newActionScript = loadFile('scripts/frontend/reactRouter-redux/action.js')
        helpers.writeFile('scripts/action.js', newActionScript)
    }

    if (type === 'redux') {
        store.reactType = 'reactRouter-redux'
    } else if (type !== 'unknown') {
        store.reactType = 'react-router'
    }
    addProjectInstructions()
}

let blixRedux = () => {
    helpers.mkdirSync('src/components')
    helpers.mkdirSync('src/components/App')
    helpers.moveAllFilesInDir('./src/App', './src/components/App')

    createView('redux')
}

let blixReact = () => {
    helpers.mkdirSync('src/components')
    helpers.mkdirSync('src/components/App')
    helpers.moveAllFilesInDir('./src/App', './src/components/App')

    createView()
}

let createReactApp = () => {
    helpers.mkdirSync('src/components')
    helpers.mkdirSync('src/components/App')

    helpers.rename('./src/App.js', './src/components/App/App.js')
    if (fs.existsSync('./src/App.css')) {
        helpers.rename('./src/App.css', './src/components/App/App.css')
    }
    if (fs.existsSync('./src/logo.svg')) {
        helpers.rename('./src/logo.svg', './src/components/App/logo.svg')
    }
    if (fs.existsSync('./src/App.test.js')) {
        helpers.rename('./src/App.test.js', './src/components/App/App.test.js')
    }
    createView()
}
