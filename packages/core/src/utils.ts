const store = require('./store')
import { logError } from './logger'
import { execute } from './process'

export function getCWDName(): string {
    let rawCWD: string = process.cwd()
    let cwdArr: string[] = rawCWD.split('/')
    let cwdName: string = cwdArr.pop() || ""
    return cwdName
}

export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

// TODO need a sleep function

export function prettyPath (path: string): string {
   let pathStartCharacters = path.slice(0, 2) 

   if (pathStartCharacters === './') {
       path = path.slice(2)
   }

   return path
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



