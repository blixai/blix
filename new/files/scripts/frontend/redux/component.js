const fs = require("fs");
const path = require("path");

// assign name from user command line input and capitalize the first letter (per React Component Naming Conventions)
let name = process.argv[2];
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);
// retrieve the type of component the user is trying to create if none it defaults to stateful but if "stateless" will create a stateless component and container
const type = process.argv[3];

// helper to load files, returns file data
const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

let statelessComponentTemplate = loadFile(
  "./templates/statelessComponentTemplate.js"
);
statelessComponentTemplate = statelessComponentTemplate.replace(
  /Name/g,
  `${name}`
);

let statelessContainerTemplate = loadFile(
  "./templates/statelessContainerTemplate.js"
);
statelessContainerTemplate = statelessContainerTemplate.replace(
  /Name/g,
  `${name}`
);

let statefulComponentTemplate = loadFile(
  "./templates/statefulComponentTemplate.js"
);
statefulComponentTemplate = statefulComponentTemplate.replace(
  /Name/g,
  `${name}`
);

let containerTemplate = loadFile("./templates/containerTemplate.js");
containerTemplate = containerTemplate.replace(/Name/g, `${name}`);

const createFiles = () => {
  fs.mkdirSync(`./src/components/${name}`);
  if (type === "stateless") {
    fs.writeFile(
      `./src/components/${name}/${name}.js`,
      statelessComponentTemplate,
      err => {
        if (err) return console.log(err);
        console.log(`The Component ${name} was created!`);
      }
    );
    fs.writeFile(
      `./src/components/${name}/${name}Container.js`,
      containerTemplate,
      err => {
        if (err) return console.log(err);
        console.log(`The Container ${name} was created!`);
      }
    );
  } else {
    fs.writeFile(
      `./src/components/${name}/${name}.js`,
      statefulComponentTemplate,
      err => {
        if (err) return console.log(err);
        console.log(`The Component ${name} was created!`);
      }
    );
    fs.writeFile(
      `./src/components/${name}/${name}Container.js`,
      containerTemplate,
      err => {
        if (err) return console.log(err);
        console.log(`The Container ${name} was created!`);
      }
    );
    fs.writeFile(`./src/components/${name}/${name}.css`, "", err => {
      if (err) return console.log(err);
      console.log("CSS File was Created");
    });
  }
};

if (!name) {
  console.log(
    "You need to supply a name in order to create new components/containers."
  );
  console.log(
    "Here is an example of creating a stateful component, associated container, and CSS file: npm run component <componentName>"
  );
  console.log(
    "To create a stateless component: npm run component <componentName> stateless"
  );
  console.log("Please try again.");
} else {
  createFiles();
}
