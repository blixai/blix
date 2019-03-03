const path = require('path')
const fs = require("fs")
const helpers = require("../../../dist/src")
const { loadFile } = helpers


const addAPIScript = () => {
    let apiScript = loadFile('scripts/frontend/api/api.js')
    let apiTemplate = loadFile('scripts/frontend/api/templates/api.js')

    helpers.writeFile('scripts/api.js', apiScript)
    helpers.writeFile('scripts/templates/api.js', apiTemplate)

    helpers.addScriptToPackageJSON('api', 'node scripts/api.js')
    helpers.addDependenciesToStore('axios')
}

module.exports = addAPIScript