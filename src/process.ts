import { execSync } from 'child_process'


// child_process exec sync wrapper 
export function execute(command: string) {
    execSync(command, { stdio: [0, 1, 2] })
}