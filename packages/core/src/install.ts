import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as ora from 'ora'

import { execSync } from 'child_process'
import { mkdirSync } from './fs'
import { logInsert } from './logger'
import { execute } from './process'
import store from './store'
import { _logCaughtError } from './utils'

export function canUseYarn() {
  if (fs.existsSync('yarn.lock')) {
    store.useYarn = true
    return true
  } else if (fs.existsSync('package-lock.json')) {
    store.useYarn = false
    return false
  }
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

const yarnPrompt = {
  message: 'Do you want to use Yarn to install packages',
  name: 'yarn',
  type: 'confirm',
}

export async function yarn() {
  if (canUseYarn() && store.useYarn === '') {
    const yarnAnswer: any = await inquirer.prompt([yarnPrompt])
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
    const buffer: any = fs.readFileSync('./package.json')
    const packageJson = JSON.parse(buffer)
    return scriptName in packageJson.scripts
  } catch (err) {
    _logCaughtError(`Error finding ${scriptName} in package.json`, err)
    return false
  }
}

export async function installAllPackages() {
  if (store.dependencies) {
    await installDependencies(store.dependencies)
  }

  if (store.devDependencies) {
    await installDependencies(store.devDependencies, 'dev')
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
    const buffer: any = fs.readFileSync(filePath)
    const json = JSON.parse(buffer) // jslint-ignore
    json.scripts[command] = script
    const newPackage = JSON.stringify(json, null, 2)
    fs.writeFileSync(filePath, newPackage)
    logInsert(`${command} script into package.json`)
  } catch (err) {
    _logCaughtError(`Failed to add script ${command} to package.json`, err)
  }
}

export async function installDependencies(packages: string, type?: string) {
  const spinnerText =
    type === 'dev'
      ? ' Downloading development dependencies'
      : ' Downloading dependencies'
  const spinner = ora(spinnerText).start()

  try {
    if (store.name) {
      process.chdir(`./${store.name}`)
    }
    if (store.useYarn) {
      const command =
        type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`
      await execute(command)
    } else {
      const command =
        type === 'dev'
          ? `npm install --save-dev ${packages}`
          : `npm install --save ${packages}`
      await execute(command)
    }
    if (store.name) {
      process.chdir('../')
    }
    spinner.succeed()
  } catch (err) {
    if (store.name) {
      process.chdir('../')
    }
    spinner.fail()
    _logCaughtError('Something went wrong while installing the packages', err)
  }
}

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
