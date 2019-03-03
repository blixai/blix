const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require("fs");
const path = require("path");
let name = process.argv[2] || "";

// takes the name and capitalizes the first letter per React naming conventions
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);

// helper to load template files for manipulation
const loadFile = filePath => {
    return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

const createStateful = () => {
  let stateful = loadFile("./templates/statefulComponent.js")
  let container = loadFile("./templates/container.js")
  stateful = stateful.replace(/Name/g, `${name}`);
  container =  container.replace(/Name/g, `${name}`)

  try {
    fs.mkdirSync(`./src/${name}`);
    fs.writeFileSync(`./src/${name}/${name}.js`, stateful);
    fs.writeFileSync(`./src/${name}/${name}Container.js`, container)
    fs.writeFileSync(`./src/${name}/${name}.css`, "");
    console.log(`Created folder src/${name}`);
    console.log(`Created component ${name} in src/${name}/${name}.js`);
    console.log(`Created container ${name}Container in src/${name}/${name}Component.js`)
    console.log(
      `Created CSS file for component ${name} in src/${name}/${name}.css`
    );
  } catch (err) {
    console.error(err);
  }
};

const createStateless = () => {
  let stateless = loadFile("./templates/statelessComponent.js")
  let container = loadFile("./templates/container.js")
  stateless = stateless.replace(/Name/g, `${name}`);
  container =  container.replace(/Name/g, `${name}`)

  try {
    fs.mkdirSync(`./src/${name}`);
    fs.writeFileSync(`./src/${name}/${name}.js`, stateless);
    fs.writeFileSync(`./src/${name}/${name}Container.js`, container)
    fs.writeFileSync(`./src/${name}/${name}.css`, "");
    console.log(`Created folder src/${name}`);
    console.log(`Created component ${name} in src/${name}/${name}.js`);
    console.log(`Created container ${name}Container in src/${name}/${name}Component.js`)
    console.log(
      `Created CSS file for component ${name} in src/${name}/${name}.css`
    );
  } catch (err) {
    console.error(err);
  }
};

const askState = () => {
  rl.question("? Stateful Component: (Y/n) ", answer => {
    answer = answer.toLowerCase();
    if (answer === "y") {
      rl.close();
      createStateful();
    } else if (answer === "n") {
      rl.close();
      createStateless();
    } else {
      console.log(`? you didn't enter a y or n. Please try again`);
      askState();
    }
  });
};

// begins file execution
console.clear();
if (name) {
  if (fs.existsSync(`./src/${name}`)) {
    console.log(`That component already exists at src/${name} !!`);
    console.log("Please try again");
    process.exit();
  }
  askState();
} else {
  console.log("No component name provided.");
  console.log("Example: npm run component footer");
  console.log(
    "This will create a component Footer in src/Footer with files Footer.js and Footer.css"
  );
  console.log(
    "You can edit the Component templates by going to scripts/templates and opening the statefulComponent.js or statelessComponent.js files."
  );
  console.log("Please try again");
  process.exit();
}
