/* tslint:disable:no-console */
import chalk from 'chalk'
import Debug from 'debug'
import * as logSymbols from 'log-symbols'
import * as readline from 'readline'
import store from './store'

const createDebug = Debug('blix:core:fs:create')
const deleteDebug = Debug('blix:core:fs:delete')
const mutateDebug = Debug('blix:core:fs:mutate')
const insertDebug = Debug('blix:core:fs:insert')
const appendDebug = Debug('blix:core:fs:append')
const invokeDebug = Debug('blix:core:fs:invoke')

export function logError(msg: string) {
  console.error(chalk`{red ${msg}}`)
}

export function logWarning(msg: string) {
  console.warn(chalk`{yellow ${msg}}`)
}

export function logTaskStatus(task: string, status: string, symbol?: string) {
  let stringToStore: any = ''
  if (symbol) {
    stringToStore = `${symbol} ${task}`
  } else {
    //  prettier-ignore
    // @ts-ignore
    stringToStore = `${logSymbols[status] ? logSymbols[status] : logSymbols.success}  ${task}`
  }
  store.tasks.push(stringToStore)
  if (store.env !== 'development') {
    clearConsole()
  }
  store.tasks.forEach((storedTask: string) => {
    console.log(storedTask)
  })
}

// logger action methods

export function logCreate(msg: string) {
  if (store.env === 'development') {
    createDebug('create %s', msg)
  }
}

export function logDeleted(msg: string) {
  if (store.env === 'development') {
    deleteDebug('delete %s', msg)
  }
}

export function logMutate(msg: string) {
  if (store.env === 'development') {
    mutateDebug('mutate %s', msg)
  }
}

export function logInsert(msg: string) {
  if (store.env === 'development') {
    insertDebug('insert %s', msg)
  }
}

export function logAppend(msg: string) {
  if (store.env === 'development') {
    appendDebug('append %s', msg)
  }
}

export function logInvoke(msg: string) {
  if (store.env === 'development') {
    invokeDebug('invoke %s', msg)
    console.log(chalk`{blue invoke} ${msg}`)
  }
}

function _basicConsoleHeader(blixVersion: string) {
  return chalk.bold.cyan(`Blix v${blixVersion}`)
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
    } else if (store.mode === 'cli' && store.blixNeedsUpdate) {
      console.log(_basicConsoleHeader(store.blixVersion))
      console.log()
      console.log(
        chalk.bold.red(
          `Blix update available. Please update to the latest version${
            store.blixLatestVersion ? ': ' + store.blixLatestVersion : ''
          }`,
        ),
      )
      console.log()
    } else if (store.mode === 'cli') {
      console.log(_basicConsoleHeader(store.blixVersion))
      console.log()
    }
  }
}
