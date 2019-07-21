const fs = require('fs')
const path = require('path')

function _loadFile(filePath) {
    return fs.readFileSync(path.resolve(__dirname,  filePath), 'utf8')
}

module.exports = {
    _loadFile
}