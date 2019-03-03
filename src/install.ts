const fs = require('fs')
import { execSync } from 'child_process'
const chalk = require('chalk');
const store = require('../store')
const prompt = require('inquirer')
const { yarnPrompt } = require('../cli/prompts')
import { execute } from './process'
import { _logCaughtError } from '../.internal/blixInternal'
import {
    mkdirSync,
    writeFile
} from './fs'


export function canUseYarn() {
    if (fs.existsSync('yarn.lock')) {
        store.useYarn = true
        return true
    } else if (fs.existsSync('package-lock.json')) {
        store.useYarn = false
        return false
    }
    try {
        execSync("yarnpkg --version", { stdio: "ignore" });
        return true;
    } catch (e) {
        return false;
    }
}

export async function yarn() {
    if (canUseYarn() && store.useYarn === '') {
        let yarnAnswer = await prompt([yarnPrompt])
        store.useYarn = yarnAnswer.yarn
    }
}

export function checkScriptsFolderExist() {
    if (!fs.existsSync('./scripts')) {
        mkdirSync('scripts')
        mkdirSync('scripts/templates')
    } else if (!fs.existsSync('./scripts/templates')) {
        mkdirSync('scripts/templates')
    }        
}

export function checkIfScriptIsTaken(scriptName: string): boolean {
    try {
        let buffer = fs.readFileSync('./package.json')
        let packageJson = JSON.parse(buffer)
        return scriptName in packageJson['scripts']
    } catch (err) {
        _logCaughtError(`Error finding ${scriptName} in package.json`, err)
        return false
    }
}

export function installAllPackages() {
    if (store.dependencies) {
        installDependencies(store.dependencies)
    }
    
    if (store.devDependencies) {
        installDependencies(store.devDependencies, 'dev')
    }
}

export function addScriptToPackageJSON(command: string, script: string) {
    let filePath = ''
    if (store.name) {
        filePath = `./${store.name}/package.json`
    } else {
        filePath = './package.json'
    }

    try {
        let buffer = fs.readFileSync(filePath);
        let json = JSON.parse(buffer);
        json.scripts[command] = script;
        let newPackage = JSON.stringify(json, null, 2);
        writeFile(filePath, newPackage);
        console.log(chalk`{cyan insert} ${command} script into package.json`)
    } catch (err) {
        _logCaughtError(`Failed to add script ${command} to package.json`, err)
    }
};

export function installDependencies(packages: string, type?: string) {
    try {
        if (store.name) {
        process.chdir(`./${store.name}`)
        }
        if (store.useYarn) {
        let command = type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`
        execute(command)
        } else {
        let command = type === 'dev' ? `npm install --save-dev ${packages}` : `npm install --save ${packages}`
        execute(command);
        }
        if (store.name) process.chdir('../')
    } catch(err) {
        if (store.name) process.chdir('../')
        _logCaughtError('Something went wrong while installing the packages', err)
    }
};

/**
 * 
 * @param {string} deps - string of space separated packages to install
 * @param type - string of any kind, usually 'dev' to indicate to add as a devDependency
 */
export function addDependenciesToStore(deps: string, type?: string) {
    if (type) {
        if (!store.devDependencies) {
            store.devDependencies = deps
        } else {
            store.devDependencies += ' ' + deps
        }
    }
    
    if (!type) {
        if (!store.dependencies) {
            store.dependencies = deps
        } else {
            store.dependencies += ' ' + deps
        }
    }
}