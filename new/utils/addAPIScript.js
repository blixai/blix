const path = require('path')
const fs = require("fs")
const helpers = require("../../helpers")

const loadFile = filePath => {
    return fs.readFileSync(path.resolve(__dirname, "../files/" + filePath), "utf8")
}

const addAPIScript = () => {
    let apiScript = loadFile('scripts/frontend/api/api.js')
    let apiTemplate = loadFile('scripts/frontend/api/templates/api.js')

    helpers.writeFile('scripts/api.js', apiScript)
    helpers.writeFile('scripts/templates/api.js', apiTemplate)

    helpers.addScriptToPackageJSON('api', 'node scripts/api.js')
    helpers.addDependenciesToStore('axios')
}

module.exports = addAPIScript