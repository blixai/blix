const fs = require("fs");
const path = require("path");
const readLine = require("readline");
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const log = console.log;

// helper function to load files
const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// assign name and ensure name given is capitalized as view is still a react class
let name = process.argv[2] || "";
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
name = capitalizeFirstLetter(name);

// need to see if view should be stateful or stateless
const askRoute = () => {
  rl.question("? Please enter the url route to the view: ", answer => {
    if (answer !== "") {
      // check for character for a '/' if it has one remove it
      if (answer.charAt(0) === "/") {
        answer = answer.slice(1);
      }
      askState(answer);
    } else {
      log("No route entered. Please try again");
      askRoute();
    }
  });
};

const askState = route => {
  rl.question("? Is this view stateful: (Y/n) ", answer => {
    answer = answer.toLowerCase();
    if (answer === "y") {
      createStatefulView(route);
    } else {
      createStatelessView(route);
    }
    addComponentsToView();
  });
};

const createStatefulView = route => {
  let data = loadFile("./templates/statefulComponent.js");
  let stateful = data.replace(/Name/g, `${name}`);
  stateful = stateful.replace(/Name/g, `${name}`);
  stateful = stateful.split("\n");
  stateful.splice(1, 1);
  stateful = stateful.join("\n");
  fs.writeFileSync(`./src/views/${name}.js`, stateful);
  addRoute(route);
};

const createStatelessView = route => {
  let stateless = loadFile("./templates/statelessComponent.js");
  stateless = stateless.replace(/Name/g, `${name}`);
  stateless = stateless.split("\n");
  stateless.splice(1, 1);
  stateless = stateless.join("\n");
  fs.writeFileSync(`./src/views/${name}.js`, stateless);
  addRoute(route);
};

const addRoute = route => {
  let search = "<Switch>";
  let body = fs.readFileSync("./src/Router.js", "utf8").toString();
  if (body.indexOf(`/${route}`) !== -1) {
    console.log(`Route already exists in src/Router.js!!`);
    return;
  }
  body = body.split("\n");
  body.splice(4, 0, `import ${name} from './views/${name}'`);
  let newBody = body.join("\n");
  let position = newBody.indexOf(search);
  let newRoute = `\n\t\t\t\t  <Route exact path='/${route}' render={(history) => {\n\t\t\t\t\u0020\u0020\u0020\u0020return <${name}/>\n\t\t\t\t  }}/>`;
  let output = [
    newBody.slice(0, position + 8),
    newRoute,
    newBody.slice(position + 8)
  ].join("");
  fs.writeFileSync("./src/Router.js", output);
};

const addComponentsToView = () => {
  let folders = [];
  let p = `./src/components`;

  fs.readdirSync("./src/components").forEach(file => {
    let filePath = `${p}/` + `${file}`;
    let stats = fs.statSync(filePath, "utf8");
    if (stats.isDirectory()) {
      folders.push(file);
    }
  });
  log("Components: ", folders);
  rl.question(
    "? Which components should be used by this view: (you can enter more than one at a time, case-sensitive) ",
    components => {
      rl.close();
      components = components.split(" ");
      components.map(component => {
        if (folders.includes(component)) {
          let view = fs
            .readFileSync(`./src/views/${name}.js`, "utf8")
            .toString();
          let search = `import ${component} from '../components/${component}/${component}';`;
          let secondSearch = `import ${component}Component from '../components/${component}/${component}';`
          if (view.indexOf(search) !== -1 || view.indexOf(secondSearch) !== -1) {
            log(`This view already has the ${component} component`);
          } else if (view.indexOf(component) !== -1) {
            // view is named the same as the component and could cause a conflict so import it <componentName>Component
            view = view.split("\n");
            view.splice(1, 0, secondSearch);
            view = view.join("\n");
            fs.writeFile(`./src/views/${name}.js`, view, err => {
              if (err) {
                log(
                  `Something went wrong. Failed to add ${component} to view ${name}`
                );
              } else {
                log(
                  `Imported ${component} component into src/views/${name}.js`
                );
              }
            }); 
          } else {
            // rewrite the view
            view = view.split("\n");
            view.splice(1, 0, search);
            view = view.join("\n");
            fs.writeFile(`./src/views/${name}.js`, view, err => {
              if (err) {
                log(
                  `Something went wrong. Failed to add ${component} to view ${name}`
                );
              } else {
                log(
                  `Imported ${component} component into src/views/${name}.js`
                );
              }
            });
          }
        }
      });
    }
  );
};

if (name) {
  // see if its a new view, if not ask to add components/containers or styles
  if (fs.existsSync(`./src/views/${name}.js`)) {
    rl.question(
      "? That view already exists, do you want to add components to that view: (Y/n) ",
      answer => {
        answer = answer.toLowerCase();
        if (answer === "y") {
          addComponentsToView();
        } else {
          process.exit();
        }
      }
    );
  } else {
    askRoute();
  }
} else {
  log("No View name provided.");
  log("Example: npm run view about");
  log(
    "This will create a component About in src/views and add a route to src/Router.js as well as give the option to import components into the view"
  );
  log("Please try again");
  process.exit();
}
