const helpers = require('../helpers')
const fs = require('fs')
const chalk = require('chalk')
const execSync = require('child_process').execSync
let possibleScripts = ['component', 'view', 'model', 'page', 'controller', 'action', 'api']


exports.generate = (scriptArg, otherArgs = '') => {
    if (!fs.existsSync('package.json')) {
        console.error(chalk.red`Unable to find package.json. Are you in a project`)
        process.exit(1)
    } else if (!scriptArg) {
        this.scriptNotFound(true)
    }
    if (possibleScripts.includes(scriptArg) && helpers.checkIfScriptIsTaken(scriptArg)) {
        if (otherArgs) {
            otherArgs = otherArgs.join(' ')
        }
        try {
            if (fs.existsSync('yarn.lock')) {
                execSync(`yarn ${scriptArg} ${otherArgs}`, { stdio: [0, 1, 2] })
            } else {
                execSync(`npm run ${scriptArg} ${otherArgs}`, { stdio: [0, 1, 2] })
            }
        } catch (err) {
            console.error('Something went wrong.')
            console.error(err)
        }
    } else {
        this.scriptNotFound()
    }
}

exports.scriptNotFound = (noArg) => {
    if (noArg) {
        console.log(chalk.red`No command type entered.`)
    } else {
        console.log(chalk.red`It seems you're trying to run a command that doesn't exist.`)
    }
    possibleScripts.forEach(script => {
        if (helpers.checkIfScriptIsTaken(script)) {
            console.log('Try: ' + chalk.green`blix generate ` + chalk`{cyan ${script}}`)
        }
    })
    console.log('Please try again.')
    process.exit() 
}