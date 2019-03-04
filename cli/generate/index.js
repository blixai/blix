const fs = require('fs')
const chalk = require('chalk')
let possibleScripts = ['component', 'view', 'model', 'page', 'controller', 'action', 'api']
const { 
    checkIfScriptIsTaken,
    execute,
    logError
} = require('../../index')

exports.generate = (scriptArg, otherArgs = '') => {
    if (!fs.existsSync('package.json')) {
        logError(`Unable to find package.json. Are you in a project`)
        process.exit(1)
    } else if (!scriptArg) {
        this.scriptNotFound(true)
    }
    if (possibleScripts.includes(scriptArg) && checkIfScriptIsTaken(scriptArg)) {
        if (otherArgs) {
            otherArgs = otherArgs.join(' ')
        }
        try {
            if (fs.existsSync('yarn.lock')) {
                execute(`yarn ${scriptArg} ${otherArgs}`)
            } else {
                execute(`npm run ${scriptArg} ${otherArgs}`)
            }
            // execSync(`node scripts/${scriptArg}.js ${otherArgs}`, { stdio: [0, 1, 2] })
        } catch (err) {
            logError('Something went wrong.')
            logError(err)
        }
    } else {
        this.scriptNotFound()
    }
}

exports.scriptNotFound = (noArg) => {
    if (noArg) {
        logError('No command type entered.')
    } else {
        logError(`It seems you're trying to run a command that doesn't exist.`)
    }
    possibleScripts.forEach(script => {
        if (checkIfScriptIsTaken(script)) {
            console.log('Try: ' + chalk.green`blix generate ` + chalk`{cyan ${script}}`)
        }
    })
    console.log('Please try again.')
    process.exit() 
}