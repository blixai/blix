import chalk from 'chalk';
const readline = require('readline')
const store = require('./store')
const logSymbols = require('log-symbols');

export function logError(msg: string) {
    console.error(chalk`{red ${msg}}`)
}

export function logWarning(msg: string) {
    console.warn(chalk`{yellow ${msg}}`)
}

export function log() {
        
}

export function logTaskStatus(task: string, status: string, symbol?: string) {
    let stringToStore = '';
    if (symbol) {
        stringToStore = `${symbol} ${task}`
    } else {
        stringToStore = `${logSymbols[task] ? logSymbols[task] : logSymbols.success} ${task}`
    }
    store.tasks.push(stringToStore)

    clearConsole()
    store.tasks.forEach((task: string) => {
       console.log(task) 
    });
}

// logger action methods

export class ActionLogger {

    // TODO create the ability to check terminal width and cap string length from wrapping

    static create(msg: string) {
        console.log(chalk`{green create} ${msg}`)
    }

    static delete(msg: string) {
        console.log(chalk`{red delete} ${msg}`)
    }

    static mutate(msg: string) {
        console.log(chalk`{yellow mutate} ${msg}`)
    }

    static insert(msg: string) {
        console.log(chalk`{cyan insert} ${msg}`)
    }

    static append(msg: string) {
        console.log(chalk`{cyan append} ${msg}`)
    }

    static invoke(msg: string) {
        console.log(chalk`{blue invoke} ${msg}`)
    }
}

export function clearConsole(title?: string) {
    if (process.stdout.isTTY) {
        // @ts-ignore
        const blank = '\n'.repeat(process.stdout.rows)
        console.log(blank)
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        if (title) {
          console.log(chalk.bold.cyan(title))
        } else if (store.mode === 'cli' && store.blixVersion) {
            console.log(chalk.bold.cyan(`Blix v${store.blixVersion}`))
            console.log()
        }
    }
}


