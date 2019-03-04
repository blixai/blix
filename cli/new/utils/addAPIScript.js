const { 
    loadFile,
    writeFile,
    addScriptToPackageJSON,
    addDependenciesToStore
} = require('../../../index')


const addAPIScript = () => {
    let apiScript = loadFile('scripts/frontend/api/api.js')
    let apiTemplate = loadFile('scripts/frontend/api/templates/api.js')

    writeFile('scripts/api.js', apiScript)
    writeFile('scripts/templates/api.js', apiTemplate)

    addScriptToPackageJSON('api', 'node scripts/api.js')
    addDependenciesToStore('axios')
}

module.exports = addAPIScript