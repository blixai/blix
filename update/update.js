let shell = require('shelljs')
const execSync = require('child_process').execSync;

let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn global add ${packages}`)
  } else {
    shell.exec(`npm install -g ${packages}`)
  }
}

let update = () => {
  install('@dbull7/enzo')
}

module.exports = update