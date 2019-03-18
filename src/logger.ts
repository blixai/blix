import chalk from 'chalk';
const readline = require('readline')

export function logError(msg: string) {
    console.error(chalk`{red ${msg}}`)
}

export function logWarning(msg: string) {
    console.warn(chalk`{yellow ${msg}}`)
}

export function log() {
        
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
        }
    }
}


