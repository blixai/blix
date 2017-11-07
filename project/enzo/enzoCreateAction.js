let fs = require('fs');
let path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
let log = console.log;

let actionTemplate = fs.readFileSync(
  path.resolve(__dirname, './templates/actionTemplate.js'),
  'utf8'
);

rl.question('? What is the actions name: ', ans => {
  let lowercase = ans.toLowerCase();
  let upperCase = ans.toUpperCase();
  actionTemplate = actionTemplate.replace(/name/g, lowercase);
  actionTemplate = actionTemplate.replace(/NAME/g, upperCase);

  fs.appendFile('./src/actions/index.js', actionTemplate, function(err) {
    if (err) throw err;
    console.log(`${ans} controller created`);
  });

  //   rl.question('? What is the reducers name: ', reducer => {
  //     reducer = reducer.toLowerCase();
  //     if (fs.existsSync(`./src/reducers/${reducer}.js`)) {
  //       // add it to the switch
  //       // use node append file
  //     } else {
  //       // create reducer
  //       fs.writeFile(`./src/reducers/${reducer}.js`, '', err => {
  //         if (err) throw err;
  //       });
  //     }
  //   });
});
