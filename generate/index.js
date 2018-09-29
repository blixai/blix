const helpers = require('../helpers')
const fs = require('fs')
const chalk = require('chalk')
const execSync = require('child_process').execSync
let possibleScripts = ['component', 'view', 'model', 'page', 'controller', 'action']


const generate = () => {
    if (!fs.existsSync('package.json')) {
        console.error(chalk.red`Unable to find package.json. Are you in a project`)
        process.exit(1)
    } else if (!process.argv[3]) {
        noArg()
    }

    if (possibleScripts.includes(process.argv[3]) && helpers.checkIfScriptIsTaken(process.argv[3])) {
        try {
            if (fs.existsSync('yarn.lock')) {
                execSync(`yarn ${process.argv[3]} ${process.argv.slice(4).join(' ')}`, { stdio: [0, 1, 2] })
            } else {
                execSync(`npm run ${process.argv[3]} ${process.argv.slice(4).join(' ')}`, { stdio: [0, 1, 2] })
            }
        } catch (err) {
            console.error('Something went wrong.')
            console.error(err)
        }
    } else {
        scriptNotFound()
    }
}

module.exports = generate 

const noArg = () => {
    console.log(chalk.red`No command type entered.`)
    possibleScripts.forEach(script => {
        if (helpers.checkIfScriptIsTaken(script)) {
            console.log('Try: ' + chalk.green`blix generate ` + chalk`{cyan ${script}}`)
        }
    })
    console.log('Please try again.')
    process.exit()
}

const scriptNotFound = () => {
    console.log(chalk.red`It seems you're trying to run a command that doesn't exist.`)
    possibleScripts.forEach(script => {
        if (helpers.checkIfScriptIsTaken(script)) {
            console.log('Try: ' + chalk.green`blix generate ` + chalk`{cyan ${script}}`)
        }
    })
    console.log('Please try again.')
    process.exit() 
}