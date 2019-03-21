import { spawnSync } from 'child_process'
const store = require('./store')


// child_process exec sync wrapper 
export function execute(command: string, showOutput?: boolean) {
    if (showOutput || store.env === 'development') {
        spawnSync(command, { stdio: [0, 1, 2], shell: true })
    } else {
        spawnSync(command, { stdio: 'ignore', shell: true })
    }
}


// TODO function to safely change process directory