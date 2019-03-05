const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
import { prompt } from "inquirer"
const store = require('./store')
const Mustache = require('mustache')
import { _logCaughtError } from '../.internal/blixInternal'
import { logError, logWarning } from './logger'


export function writeFile(filePath: string, file: string, message?: string) {
    try {
        filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
        let filePathLog = filePath.slice(2)
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, file)
            message ? console.log(message) : console.log(chalk`{yellow mutate} ${filePathLog}`);
        } else {
            fs.writeFileSync(filePath, file)
            message ? console.log(message) : console.log(chalk`{green create} ${filePathLog}`);
        }
    } catch (err) {
        _logCaughtError(`Couldn't create file ${filePath}`, err)
    }
}

export function mkdirSync(folderPath: string, message?: string) {
    if (!folderPath && !store.name) {
        return logError(`Unable to create folder`)
    } else if (!folderPath) {
        folderPath = ''
    }
    
    try {
        folderPath = store.name ? `./${store.name}/` + folderPath : './' + folderPath
        let folderPathLog = folderPath.slice(2)
        fs.mkdirSync(folderPath)
        message ? console.log(message) : console.log(chalk`{green create} ${folderPathLog}`)
    } catch (err) {
        _logCaughtError(`Error making directory ${folderPath}`, err)
    }
}

export function rename(oldName: string, newName: string) {
    try {
        fs.renameSync(oldName, newName)
        oldName = oldName.slice(2)
        newName = newName.slice(2)
        logWarning(`move   ${oldName} into ${newName}`)
    } catch (err) {
        _logCaughtError(`Error renaming ${oldName}`, err)
    }
}

export async function insert(fileToInsertInto: string, whatToInsert: string, lineToInsertAt?: number) {
    if (!fileToInsertInto) {
        return logError(`No file specified.`)
    } else if (!whatToInsert) {
        return console.error(chalk`{red No string to insert specified.}`) 
    }
    // this needs to get extracted into its own helper
    let fileToInsertIntoLog
    if (fileToInsertInto.slice(1, 2) === './') {
    fileToInsertIntoLog = fileToInsertInto.slice(2)
    } else {
    fileToInsertIntoLog = fileToInsertInto
    }

    let filePrompt = { type: 'list', name: 'lineNumber', message: 'Select a line to insert below', choices: [] }
    // if no lineToInsertAt then readfile and pass to inquirer prompt
    try {
    let file = fs.readFileSync(fileToInsertInto, 'utf8').toString().split('\n')
    if (lineToInsertAt === undefined) {
        filePrompt.choices = file
        let lineToInsertAfter = await prompt([filePrompt])
        lineToInsertAt = file.indexOf(lineToInsertAfter) + 1

    } else if (isNaN(Number(lineToInsertAt))) {
        let indexToFind = file.indexOf(lineToInsertAt)
        if (indexToFind !== -1) {
        lineToInsertAt = indexToFind + 1
        } else {
        lineToInsertAt = file.length + 1
        }
    }
    file.splice(lineToInsertAt, 0, whatToInsert)
    file = file.join('\n')
    fs.writeFileSync(fileToInsertInto, file)

    console.log(chalk`{cyan insert} ${fileToInsertIntoLog}`)
    } catch (err) {
        _logCaughtError(`Failed to insert into ${fileToInsertIntoLog}`, err)
    }
}

export function appendFile(file: string, stringToAppend: string) {
    if (!file) {
        return logError(`File not provided.`)
    } else if (!stringToAppend) {
        return logError(`No string to append provided.`)
    }
    
    try {
        file = store.name ? `./${store.name}/` + file : './' + file
        fs.appendFileSync(file, stringToAppend)
        file = file.slice(2)
        console.log(chalk`{cyan append} ${file}`)
    } catch (err) {
        _logCaughtError(`Failed to append ${file}.`, err);
    }
}

export function moveAllFilesInDir(dirToSearch: string, dirToMoveTo: string) {

    try {
        fs.readdirSync(dirToSearch).forEach((file: string) => {
            if (file === 'actions' || file === 'components' || file === 'store' || file === 'api') {
                return
            }
            try {
                rename(dirToSearch + '/' + file, dirToMoveTo + '/' + file)
            } catch(err) {
                _logCaughtError(`Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`, err)
            }
        })
    } catch(err) {
        _logCaughtError(`Failed to read directory`, err)
        return 
    }

    try {
        fs.rmdirSync(dirToSearch)
        dirToSearch = dirToSearch.slice(2)
        console.log(chalk`{red delete} ${dirToSearch}`)
    } catch (err) {
        _logCaughtError(`Failed to delete ${dirToSearch}.`, err)
    }
}

export function loadFile(file: string, folderPath: string): string {
    let filePathStartCharacters = file.slice(0, 2)
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates/'
    }
    if (filePathStartCharacters === './') {
        file = file.slice(1)
    }
    
    try {
        if (store.mode === 'cli') {
            file = fs.readFileSync(path.resolve(__dirname, folderPath + file), 'utf8')      
        } else {
            file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8')
        }
        if (!file) {
            throw `File ${file} not found!`
        }
        return file;
    } catch (err) {
        _logCaughtError(`Failed to load file ${file}`, err)
        return ""
    }
}

export function loadJSONFile(file: string, folderPath: string): string {
    // TODO ensure the file type is .json
    let filePathStartCharacters = file.slice(0, 2)
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates'
    }

    if (filePathStartCharacters === './') {
        file = file.slice(1)
    }

    try {
        if (store.mode === 'cli') {
            file = fs.readFileSync(path.resolve(__dirname, folderPath + file), 'utf8')
        } else {
            file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8')
        }
        if (!file) {
            throw `JSON file ${file} not found!`
        }
        return JSON.parse(file)
    } catch (err) {
        _logCaughtError(`Failed to load json file ${file}`, err)
        return ""
    }
}

export function writeJSONFile(filePath: string, file: object) {
    try {
        let fileString = JSON.stringify(file, null, 2)
        filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
        let filePathLog = filePath.slice(2)
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, fileString)
            console.log(chalk`{yellow mutate} ${filePathLog}`);
        } else {
            fs.writeFileSync(filePath, fileString)
            console.log(chalk`{green create} ${filePathLog}`);
        }
    } catch (err) {
        _logCaughtError(`Failed to write to file ${filePath}`, err)
    }
}

/**
 * load a package.json from the cli user directly, often used for package.json checks/file manipulation 
 * @param file 
 */
export function loadUserJSONFile(file: string): string {
    // TODO ensure the file type is .json
    let filePathStartCharacters = file.slice(0, 2)

    if (filePathStartCharacters === './') {
        file = file.slice(1)
    }

    try {
        file = fs.readFileSync('./' + file, 'utf8')
        if (!file) {
            throw `JSON file ${file} not found!`
        }
        return JSON.parse(file)
    } catch (err) {
        _logCaughtError(`Failed to load json file ${file}`, err)
        return ""
    }
}

export function loadTemplate(file: string, options?: object, folderPath?: string): string {
    let filePathStartCharacters = file.slice(0, 2)
    if (!folderPath) {
        folderPath = store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates/'
    }
    if (filePathStartCharacters === './') {
        file = file.slice(1)
    }
    
    try {
        if (store.mode === 'cli') {
            file = fs.readFileSync(path.resolve(__dirname, folderPath + file), 'utf8')      
        } else {
            file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8')
        }
        if (!file) {
            throw `File ${file} not found!`
        }
        let renderedFile = Mustache.render(file, options)
        return renderedFile;
    } catch (err) {
        _logCaughtError(`Failed to load template ${file}`, err)
        return ""
    } 
}