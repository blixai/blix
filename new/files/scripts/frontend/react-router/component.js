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

const createStateful = name => {
  let data = fs.readFileSync(
    path.resolve(__dirname, "./templates/statefulComponent.js"),
    "utf8"
  );
  let stateful = data.replace(/Name/g, `${name}`);
  fs.mkdirSync(`./src/components/${name}`);
  fs.writeFile(`./src/components/${name}/${name}.js`, stateful, err => {
    if (err) console.error(err);
  });
  fs.writeFile(`./src/components/${name}/${name}.css`, "", err => {
    if (err) console.error(err);
  });
};

const createStateless = name => {
  let stateless = fs.readFileSync(
    path.resolve(__dirname, "./templates/statelessComponent.js"),
    "utf8"
  );
  stateless = stateless.replace(/Name/g, `${name}`);
  fs.mkdirSync(`./src/components/${name}`);
  fs.writeFile(`./src/components/${name}/${name}.js`, stateless, err => {
    if (err) console.error(err);
  });
  fs.writeFile(`./src/components/${name}/${name}.css`, "", err => {
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
      console.log(`? You didn't enter a y or n. Please try again`);
      askState();
    }
  });
};

if (name) {
  askState();
} else {
    console.log("No component name provided.");
    console.log("Example: npm run component footer");
    console.log("This will create a component Footer in src/components/footer with files Footer.js and Footer.css. You choose whether the component is stateful or stateless")
    console.log("You can edit the Component templates by going to scripts/templates and opening the statefulComponent.js or statelessComponent.js files.")
    console.log("Please try again.");
  process.exit();
}
