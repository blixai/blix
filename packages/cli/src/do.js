const { logError } = require("@blixi/core")
const { lstatSync, readdirSync, existsSync, readFileSync } = require('fs')
const { join } = require('path')
const { spawn } = require('child_process')
const inquirer = require('inquirer')
const prompt = inquirer.prompt
const chalk = require('chalk')

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

async function runScript(directoryToSearch) {
    if (existsSync(`${directoryToSearch}/package.json`)) {
        try {
            const packageJSON = readFileSync(`${directoryToSearch}/package.json`, "utf8")
            const scriptsObject = JSON.parse(packageJSON)["scripts"]
            scriptChoices.choices = Object.keys(scriptsObject).map(scriptName => {
                return {
                    name: `${scriptName} : ${scriptsObject[scriptName]}`,
                    value: scriptName
                }
            })
            const selectedChoice = await prompt([scriptChoices])
            executeSelectedCommand(selectedChoice.script, directoryToSearch)
        } catch (err) {
            logError(err)
        }
    } else {
        try {
            const foundDirectories = findDirectories(directoryToSearch)
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

function findDirectories(dir) {
    const dirs = p => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory() && !ignoreList.includes(f) && f.charAt(0) !== ".")
    return dirs(dir)
}

async function executeSelectedCommand(choice, directoryToSearch) {
    let packageCommand = "npm run"
    if (existsSync('yarn.lock')) {
        packageCommand = "yarn"
    }
    additionalArgs.message += `${packageCommand} ${choice}`
    const finalArgs = await prompt([additionalArgs])
    const finalCommand = `${packageCommand} ${choice} ${finalArgs.args}`;
    console.log(`\n\n${chalk.bold('>> Executing Selected Command: ')} ${chalk.yellow(finalCommand)}`)
    spawn(finalCommand, { cwd: directoryToSearch, stdio: [0, 1, 2], shell: true })
}

module.exports = {
    runScript
}
