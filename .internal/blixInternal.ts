const fs = require('fs')
const path = require('path')
const store = require('../src/store')
const chalk = require('chalk')
import { logError } from '../src/logger';
import { execute } from '../src/process'



export function _loadFile(filePath: string): string {
    let filePathStartCharacters = filePath.slice(0, 2)
    let folderPath = './new/files/'

    if (filePathStartCharacters === './') {
        filePath = filePath.slice(1)
    }
    
    try {
        let file = fs.readFileSync(path.resolve(__dirname, folderPath + filePath), 'utf8')      
        if (!file) {
            throw `File ${file} not found!`
        }
        if (store.env === 'development') {
            console.log(chalk`{cyan load} file ${filePath}`)
        }
        return file;
    } catch (err) {
        _logCaughtError("Failed to load internal Blix file.", err);
        return ""
    }
}

export function _installDependencies(packages: string, type: string) {
    try {
        if (store.name) {
            process.chdir(`./${store.name}`)
        }
        let command: string
        if (store.useYarn) {
            command = type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`
        } else {
            command = type === 'dev' ? `npm install --save-dev ${packages}` : `npm install --save ${packages}`
        }
        execute(command)

        if (store.name) process.chdir('../')
    } catch(err) {
        if (store.name) process.chdir('../')
        _logCaughtError('Something went wrong installing the packages', err);
    }
}

export function _logCaughtError(message: string, err: string) {
    if (store.env === 'development') {
        logError(`${message}. Error: ${err}`)
    } else {
        logError(message)
    }
}
