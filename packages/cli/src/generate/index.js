const fs = require('fs')
const { 
    checkIfScriptIsTaken,
    execute,
    logError,
    _logCaughtError
} = require('@blix/core')

exports.generate = (args) => {
    if (!fs.existsSync('package.json')) {
        // TODO use Blix templates
    } else if (!args) {

        // TODO prompt if user wants to generate a blix template
        return
    }

    // TODO split the args string by spaces and then check if the first index exists

    if (checkIfScriptIsTaken(scriptArg)) {
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
            _logCaughtError("Unable execute the provided package.json script.", err)
        }
    } else {
        this.scriptNotFound()
    }
}

exports.scriptNotFound = () => {
    logError(`It seems you're trying to run a command that doesn't exist.`)
    console.log('Please try again.')
    process.exit() 
}