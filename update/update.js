let shell = require('shelljs')

let install = (packages) => {
  shell.exec(`npm install -g ${packages}`)
}

let update = () => {
  install('@dbull7/enzo')
  process.exit()
}

module.exports = update