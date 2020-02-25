#!/usr/bin/env node
const program = require('commander');
const terminalLink = require('terminal-link');
const { store, clearConsole, logError } = require('@blixai/core')
store.mode = 'cli' // this must be set before functions are compiled in order to load necessary files properly
const { createProject } = require("@blixai/cli-new");
const { notes } = require("./notes")
const { scripts } = require("./scripts/script");
const add = require("@blixai/cli-add");
const { runScript } = require("./do")
const checkIfUpdate = require("./checkForUpdate")
let pjson = require("../package.json");
let version = pjson.version
store.blixVersion = version
let currentNodeVersion = process.versions.node;
let semver = currentNodeVersion.split('.');
let major = semver[0];


const executeCommand = (program) => {

    program
        .version(version, '-v, --version')

    program
        .command('new [name]')
        .option('-s, --skip', 'Skips installation') // TODO - while it's fine to skip it needs to still add the packages to the package.json but not install
        .description('create a new project')
        .action((name, cmd) => {
            if (name) {
                store.name = name
            }
            if (cmd.skip) {
                store.skipInstallation = true
            }
            createProject()
        })

    program
        .command('add')
        .description('add tools to an existing project')
        .action(() => add())

    program
        .command('scripts')
        .description('add premade or custom scripts to a project')
        .action(() => scripts())

    program
        .command('do')
        .option('-l, --last', 'Scroll through the last used commands and press enter to execute')
        .description('show a dropdown selector of package.json scripts. Select one and press enter to execute')
        .action((cmdObject) => {
            runScript({ usePreviousCommand: cmdObject.last })
        })

    program
        .command('notes')
        .description('get all developer notes.')
        .action((args) => notes())

    program.parse(process.argv)

    if (!process.argv.slice(2).length) {
        program.outputHelp()
    }
}


const uncaughtException = () => {
    clearConsole()
    const link = terminalLink('https://github.com/blixjs/blix/issues', 'https://github.com/blixjs/blix/issues');
    logError('Critical error. You can try to learn more by enabling debug with "-d" or "--debug" and retrying your last command.')
    console.log()
    logError(`To file a bug report visit ${link}`)
}


const main = async () => {
    clearConsole()

    if (major < 8) {
        console.error(
            'You are running Node ' +
            currentNodeVersion +
            '.\n' +
            'Blix requires Node 8 or higher. \n' +
            'Please update your version of Node.'
        );
        process.exit(1);
    }
    await checkIfUpdate(pjson, { interval: 1 })
    
    const debugModeArgs = ["-d", "--debug"]
    const debugModeArgUsed = debugModeArgs.some(arg => process.argv.includes(arg))
    if (debugModeArgUsed) {
        store.env = 'development'
        process.argv = process.argv.filter(arg => !debugModeArgs.includes(arg))
    }
    executeCommand(program)
}

main()
    .then(() => {
        // TODO - usage stats?
    })
    .catch(uncaughtException)


