let shell = require('shelljs')

let install = (packages) => {
  shell.exec(`npm update -S ${packages}`)
}

let update = () => {
  install('@dbull7/enzo')
  process.exit()
}

module.exports = update