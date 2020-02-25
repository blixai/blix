const { logError } = require("@blixai/core")
const { lstatSync, readdirSync, existsSync, readFileSync } = require('fs')
const { join } = require('path')
const { spawn } = require('child_process')
const inquirer = require('inquirer')
const prompt = inquirer.prompt
const chalk = require('chalk')
const Conf = require('conf');

const configField = 'previousDoCommands'

const scriptChoices = {
    type: 'list',
    name: 'script',
    message: 'Select a script to execute.',
    choices: []
}

const projectSelector = {
    type: 'list',
    name: 'project',
    message: 'Select a project to find commands for.',
    choices: []
}

const additionalArgs = {
    type: 'input',
    name: 'args',
    message: chalk.underline('Add any additional args') + ':  '
}

const selectPreviousCommand = {
    type: 'list',
    name: 'command',
    message: 'Select a previously used "blix do" command',
    choices: []
}

async function _findAndRunPreviousCommand() {
    const config = new Conf({ projectName: 'blix' })
    selectPreviousCommand.choices = config.get(configField) || []
    const selectedCommand = await prompt([selectPreviousCommand])
    spawn(selectedCommand.command, shellObject)
}

async function runScript({ directoryToSearch = ".", usePreviousCommand = false }) {
    if (usePreviousCommand) {
        return _findAndRunPreviousCommand();
    }
    if (existsSync(`${directoryToSearch}/package.json`)) {
        try {
            const packageJSON = readFileSync(`${directoryToSearch}/package.json`, "utf8")
            const scriptsObject = JSON.parse(packageJSON)["scripts"]

            if (!scriptsObject) throw new ReferenceError("No scripts found.")

            scriptChoices.choices = Object.keys(scriptsObject).map(scriptName => {
                return {
                    name: `${scriptName} : ${scriptsObject[scriptName]}`,
                    value: scriptName
                }
            })
            const selectedChoice = await prompt([scriptChoices])
            _executeSelectedCommand({ choice: selectedChoice.script, directoryToSearch })
        } catch (err) {
            logError(err)
        }
    } else {
        try {
            const foundDirectories = _findDirectories(directoryToSearch)
            projectSelector.choices = foundDirectories
            const selectedProject = await prompt([projectSelector])
            runScript(`./${directoryToSearch}/${selectedProject.project}`)
        } catch (err) {
            logError(err)
        }
    }
}

const ignoreList = [
    "node_modules", 
]

const shellObject = { stdio: [0, 1, 2], shell: true }

function _findDirectories(dir) {
    const dirs = p => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory() && !ignoreList.includes(f) && f.charAt(0) !== ".")
    return dirs(dir)
}

function _saveCommandToHistory(command) {
    const config = new Conf({ projectName: 'blix' });
    if (config.has(configField)) {
        const previousCommands = config.get(configField)
        if (Array.isArray(previousCommands)) {
            const filteredPreviousCommands = previousCommands.filter(cmd => cmd.trim() !== command)
            filteredPreviousCommands.unshift(command)
            config.set(configField, filteredPreviousCommands)
        }
    } else {
        config.set(configField, [command])
    }
}

async function _executeSelectedCommand({ choice, directoryToSearch }) {
    let packageCommand = "npm run"
    if (existsSync('yarn.lock')) {
        packageCommand = "yarn"
    }
    additionalArgs.message += `${packageCommand} ${choice}`
    const finalArgs = await prompt([additionalArgs])
    let finalCommand = '';
    if (finalArgs.args) {
        finalCommand = `${packageCommand} ${choice} ${finalArgs.args}`;
    } else {
        finalCommand = `${packageCommand} ${choice}`
    }
    _saveCommandToHistory(finalCommand)
    console.log(`\n\n${chalk.bold('>> Executing Selected Command: ')} ${chalk.yellow(finalCommand)}`)
    shellObject.cwd = directoryToSearch
    spawn(finalCommand, shellObject)
}

module.exports = {
    runScript
}
