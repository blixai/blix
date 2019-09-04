const fs = require('fs')
const { 
    checkIfScriptIsTaken,
    execute,
    logError,
    _logCaughtError
} = require('@blixi/core')

function generate() {
    console.log("GENERATE")
}

module.exports = {
    generate
}
