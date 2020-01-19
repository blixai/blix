/* tslint:disable:no-console */
import { spawn } from 'child_process'
const store = require('./store')

// child_process exec sync wrapper
export function execute(command: string, showOutput?: boolean) {
  return new Promise((resolve, reject) => {
    let child
    if (showOutput || store.env === 'development') {
      child = spawn(command, { stdio: [0, 1, 2], shell: true })
    } else {
      child = spawn(command, { stdio: 'ignore', shell: true })
    }

    if (child.stderr && child.stdout) {
      child.stderr.on('data', data => {
        console.log(`child stdout:\n${data}`)
      })

      child.stderr.on('data', data => {
        console.log(`child stdout:\n${data}`)
      })
    }

    child.on('close', code => {
      if (code !== 0) {
        reject(`Execute failed: ${command}`)
        return
      }
      resolve()
    })
  })
}

// TODO function to safely change process directory
