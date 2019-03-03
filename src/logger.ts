import chalk from 'chalk';

export function logError(msg: string) {
    console.error(chalk`{red ${msg}}`)
}

export function logWarning(msg: string) {
    console.warn(chalk`{yello ${msg}}`)
}

export function log() {
        
}