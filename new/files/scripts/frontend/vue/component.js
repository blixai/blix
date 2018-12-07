const {
    writeFile,
    capitalize,
    loadFile
} = require('blix')
const fs = require('fs')
let name = process.argv[2] || ""

if (!name) {
    console.warn("No component name provided.")
    console.log("\nExample: npm run component footer")
    console.log("This will create a file Footer.vue in src")
    console.log("Please try again")
    process.exit()
}

name = capitalize(name)

if (fs.existsSync(`./src/components/${name}.vue`)) {
    console.error(`That component already exists at src ${name}`)
    process.exit()
}

let template = loadFile('component.vue')

template = template.replace(/Name/g, `${name}`)

writeFile(`src/components/${name}.vue`, template)
