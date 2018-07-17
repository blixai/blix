const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require("fs");
const path = require("path");
let name = process.argv[2];

// takes the name and capitalizes the first letter per React naming conventions
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);

const createStateful = name => {
  let data = fs.readFileSync(
    path.resolve(__dirname, "./templates/statefulComponent.js"),
    "utf8"
  );
  let stateful = data.replace(/Name/g, `${name}`);
  fs.mkdirSync(`./src/${name}`);
  fs.writeFile(`./src/${name}/${name}.js`, stateful, err => {
    if (err) console.error(err);
  });
  fs.writeFile(`./src/${name}/${name}.css`, "", err => {
    if (err) console.error(err);
  });
};

const createStateless = name => {
  let stateless = fs.readFileSync(
    path.resolve(__dirname, "./templates/statelessComponent.js"),
    "utf8"
  );
  stateless = stateless.replace(/Name/g, `${name}`);
  fs.mkdirSync(`./src/${name}`);
  fs.writeFile(`./src/${name}/${name}.js`, stateless, err => {
    if (err) console.error(err);
  });
  fs.writeFile(`./src/${name}/${name}.css`, "", err => {
    if (err) console.error(err);
  });
};

const askState = () => {
  rl.question("? Stateful Component: (Y/n) ", answer => {
    answer = answer.toLowerCase();
    if (answer === "y") {
      rl.close();
      createStateful(name);
    } else if (answer === "n") {
      rl.close();
      createStateless(name);
    } else {
      console.log(`? you didn't enter a y or n. Please try again`);
      askState();
    }
  });
};

if (name) {
  askState();
} else {
  console.log("No component name provided. Please try again.");
  console.log()
  process.exit();
}
