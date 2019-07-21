const fs = require('fs')
const path = require('path')
const NameTemplate = fs.readFileSync(path.resolve(__dirname, './templates/Name.js'), 'utf8')