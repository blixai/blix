const {
    writeFile,
    loadFile,
    parseArgs
} = require('blix')
const fs = require('fs')
let { name, options, fields } = parseArgs(process.argv)

if (fs.existsSync(`./src/components/${name}.vue`)) {
    console.error(`That component already exists at src ${name}`)
    process.exit()
}

let template = loadFile('component.vue')

template = template.replace(/Name/g, `${name}`)

writeFile(`src/components/${name}.vue`, template)