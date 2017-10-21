const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let fs = require('fs')

let name = process.arv[2]
let stateful;
let stateless;

if (name) {
  fs.readFile('./templates/statefulComponent.js', 'utf8', (err, data) => {
    if (err) console.error(err)
    var stateful = data.replace(/Name/g, `${name}`);
  })
  fs.readFile('./templates/statelessComponent.js', 'utf8', (err, data) => {
    if (err) console.error(err)
    var stateless = data.replace(/Name/g, `${name}`);
  })
}

if (name) {
  rl.question('Stateful Component? (Y/N) ', (answer) => {
    answer = answer.toLowerCase()
    if (answer === 'y') {
      fs.mkdirSync(`./src/${name}`)
      fs.writeFile(`./src/${name}/${name}.js`, stateful, (err) => {
        if (err) console.error(err)
      })
      fs.writeFile(`./src/${name}/${name}.css`, '', (err) => {
        if (err) console.error(err)
      })
    } else if (answer === 'n') {
      fs.mkdirSync(`./src/${name}`)
      fs.writeFile(`./src/${name}/${name}.js`, stateless, (err) => {
        if (err) console.error(err)
      })
      fs.writeFile(`./src/${name}/${name}.css`, '', (err) => {
        if (err) console.error(err)
      })
    }
  })
}

