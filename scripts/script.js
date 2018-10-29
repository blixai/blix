const fs = require("fs");
const path = require("path");
const log = console.log;
const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const helpers = require("../helpers");

// helper function to load files
let loadFile = filePath => {
  let root = '../new/files/scripts/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), "utf8");
};

const commands = {
  type: "list",
  message: "Add a blix script to a project or create your own:",
  pageSize: 10,
  name: "commands",
  choices: [
    { name: "custom: create your own script and optional template", value: "custom" },
    {
      name: "react: create a new react stateful or stateless component and css file",
      value: "react"
    },
    {
      name:
        "redux: create a new react component, and redux container",
      value: "redux"
    },
    { name: "controller: create new controller and associated endpoints", value: "controller" },
    {
      name:
        "model: create a new Bookshelf model and migration or a Mongoose model",
      value: "model"
    },
    {
      name: "action: create or add redux action to new or existing reducer and add to selected containers",
      value: "action"
    },
    {
      name: "view: create a new client side view in projects with react-router",
      value: "view"
    }
  ]
};

const custom = {
  type: "input",
  message: "What do you want to name this script:",
  name: "custom"
};

const viewType = {
  type: "confirm",
  message: "Does your project use Redux:",
  name: "view"
}

const model = {
  type: "list",
  message: "Pick a model type:",
  name: "model",
  choices: [{ name: "Mongoose", value: "m" }, { name: "Bookshelf", value: "b" }]
};

const template = {
  type: "confirm",
  message: "Do you need a template file",
  name: "template"
};

const templateName = {
  type: "input",
  message: "What do you want to name the template file:",
  name: "templateName"
};


const scripts = () => {
  console.clear();

  prompt([commands]).then(answer => {
    switch (answer.commands) {
      case "react":
        addReact();
        break;
      case "redux":
        addRedux();
        break;
      case "controller":
        addController();
        break;
      case "model":
        addModel();
        break;
      case "action":
        addAction();
        break;
      case "view":
        addClientView()
        break;
      case "custom":
        prompt([custom]).then(custom => {
          createNewScript(custom.custom);
        });
        break;
      default:
        log("Something went wrong. Please try again");
        break;
    }
  });
};

const addAction = () => {
  helpers.addScriptToPackageJSON("action", "node scripts/action.js");
  checkScriptsFolderExists();

  let action = loadFile("frontend/redux/action.js");
  let actionTemplate = loadFile("frontend/redux/templates/action.js");
  let reducerTemplate = loadFile("frontend/redux/templates/reducer.js");

  helpers.writeFile("scripts/action.js", action, "Created action.js script file in scripts folder");
  helpers.writeFile("scripts/templates/action.js", actionTemplate, "Created action template in script/templates");
  helpers.writeFile("scripts/templates/reducer.js", reducerTemplate, "Created reducer template in  script/templates");
  log("")
  log("Added script to project, to run: npm run action")
  log("This will prompt for the actions name, and the reducers name")
  log("From there it will create the action in src/action/index.js and if the reducer already exists add it to that reducer or create a reducer with that action in src/reducers.")
  log("If the reducer is created it will also be added to the rootReducer.js file in src/reducers")
  log("You will then be prompted with an array of containers from src/components/ that the action should be added to, enter each container (case-sensitive)")
  log("The action will then be imported into each selected container and added to each containers mapDispatchToProps.")
};

const addModel = () => {
  helpers.addScriptToPackageJSON("model", "node scripts/model.js");
  prompt([model]).then(ans => {
    if (ans.model === "m") {
      // add moongoose
      checkScriptsFolderExists();
      let model = loadFile("backend/mongoose.js");
      let schemaTemplate = loadFile("backend/templates/mongoose.js");

      helpers.writeFile("scripts/model.js", model, "Created model.js script file in scripts folder");
      helpers.writeFile(
        "scripts/templates/schemaTemplate.js",
        schemaTemplate,
        "Created Mongoose schema template in scripts/templates"
      );
      log("")
      log("Added script to project, to run: npm run model <name>")
      log("This creates a new model in server/models")
      log("This script accepts arguments to create a schema: npm run model <name> email:String friends:Array pin:Number")
      log("To view all valid data types go to scripts/model.js and search for 'validSchemas'")
    } else {
      // add bookshelf
      checkScriptsFolderExists();
      // load file for server/models/bookshelf.js 
      let bookshelfRequiredFile = loadFile("backend/templates/bookshelf.js");
      // load scripts files 
      let migration = loadFile("backend/templates/migration.js");
      let bookshelf = loadFile("backend/templates/bookshelf.js");
      let model = loadFile(
        "backend/bookshelf.js"
      );
      // create files 
      helpers.writeFile("scripts/model.js", model, "Created model.js script in scripts folder");
      helpers.writeFile(
        "scripts/templates/migration.js",
        migration,
        "Created knex migration template file in scripts/templates folder"
      );
      helpers.writeFile(
        "scripts/templates/bookshelf.js",
        bookshelf,
        "Created Bookshelf template file in scripts/templates folder"
      );
      // bookshelf required file needs to be placed inside the project, preferably the models folder
      try {
        helpers.writeFile("server/models/bookshelf.js", bookshelfRequiredFile);
        log("Created Bookshelf file in server/models/bookshelf.js");
      } catch (e) {
        log(
          `Failed to create a bookshelf.js file in server/models. You'll need to create this yourself.`
        );
      }
      log("")
      log("Added script to project, to run: npm run model <name>")
      log("This creates a new model in server/models, and new migration in db/migrations ")
      log("This script accepts arguments to create a schema: npm run model <name> email:string admin:boolean loggedIn:dateTime")
      log("To view all valid data types go to scripts/model.js and search for 'possibleFields'")
    }
  });
};

let addReact = () => {
  // always add script first because if there is no package.json it'll process.exit()
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  let react = loadFile("frontend/react/component.js");
  checkScriptsFolderExists();
  helpers.writeFile("scripts/component.js", react, "Created component.js script file in scripts folder");
  checkReactTemplatesExist()
  log("")
  log("Added script to project, to run: npm run component <name>")
  log("This will create a stateless or stateful component in a folder <name> within src/")
};

let addRedux = () => {
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  checkScriptsFolderExists();

  // load component script and templates 
  let redux = loadFile("frontend/redux/component.js");
  checkReactTemplatesExist()
  let container = loadFile(
    "frontend/redux/templates/container.js"
  );
  // write files
  helpers.writeFile("scripts/component.js", redux, "Created component.js script file in scripts folder");
  helpers.writeFile(
    "scripts/templates/container.js",
    container 
  );
  log("")
  log("Added script to project, to run: npm run component <name>")
  log("This will create a stateless or stateful component with a redux container in src/components")
};

let addClientView = () => {
  helpers.addScriptToPackageJSON("view", "node scripts/view.js")
  checkScriptsFolderExists()
  prompt([viewType]).then(answer => {
    // if true project uses redux
    if (answer.view) {
      let reduxViewScript = loadFile("frontend/redux/view.js")
      helpers.writeFile("scripts/view.js", reduxViewScript, "Created view.js script file in scripts folder")
      checkReactTemplatesExist()
      log("")
      log("Added script to project, to run: npm run view <name>")
      log("This will create a new stateless or stateful component in src/views and ask which components/containers to import into the view. It will also ask for a route path for the view and add this view with it's route into the App.js file.")
      log("If view already exists it will just ask what containers/components from src/components to import into that view.")
    } else {
      let reactRouterViewScript = loadFile("frontend/react-router/view.js")
      helpers.writeFile("scripts/view.js", reactRouterViewScript, "Created view.js script file in scripts folder")
      checkReactTemplatesExist()
      log("")
      log("Added script to project, to run: npm run view <name>")
      log("This will create a new stateless or stateful component in src/views and ask which components to import into the view. It will also ask for a route path for the view and add this view with it's route into the App.js file.")
      log("If view already exists it will just ask what components from src/components to import into that view.")
    }
  })
}

// make sure react component templates exist and if not create them 
let checkReactTemplatesExist = () => {
  try {
    let stateless = fs.readFileSync('./scripts/templates/statefulComponent.js', 'utf8')
    let stateful = fs.readFileSync('./scripts/templates/statelessComponent.js', 'utf8')
  } catch (err) {
    let statefulComponent = loadFile("frontend/react/templates/statefulComponent.js")
    let statelessComponent = loadFile("frontend/react/templates/statelessComponent.js")
    helpers.writeFile("scripts/templates/statefulComponent.js", statefulComponent, "Created statefulComponent template in scripts/templates/")
    helpers.writeFile("scripts/templates/statelessComponent.js", statelessComponent, "Created statelessComponent template in scripts/templates/")
  }
}

let addController = () => {
  helpers.addScriptToPackageJSON("controller", "node scripts/controller.js");

  let controller = loadFile("backend/controller.js");
  let controllerTemplate = loadFile("backend/templates/controller.js");
  let routes = loadFile("backend/templates/routes.js");

  checkScriptsFolderExists();

  helpers.writeFile("scripts/controller.js", controller, "Created controller.js script file in scripts folder");
  helpers.writeFile(
    "scripts/templates/controller.js",
    controllerTemplate,
    "Created controller.js template in scripts/templates"
  );
  helpers.writeFile(
    "scripts/templates/routes.js",
    routes,
    "Created routes.js template in scripts/templates"
  );
  log("")
  log("Added script to project, to run: npm run controller <name>")
  log("This will create a controller in server/controllers and add the associated GET/PUT/DELETE/POST routes to server/routes.js")
};

let createNewScript = name => {
  helpers.addScriptToPackageJSON(name, `node scripts/${name}.js`);
  checkScriptsFolderExists();
  helpers.writeFile(`scripts/${name}.js`, "");
  prompt([template]).then(a => {
    a = a.template;
    if (a) {
      prompt([templateName]).then(ans => {
        ans = ans.templateName;
        let importTemplate = fs.readFileSync(path.resolve(__dirname, './templates/customScript.js'), 'utf8');
        importTemplate = importTemplate.replace(/Name/g, ans)
        helpers.appendFile(`./scripts/${name}.js`, importTemplate)
        helpers.writeFile(`scripts/templates/${ans}.js`, "");
        log("");
        log(`Added script to project, to run npm run ${name}`)
        log(`Created template ${ans} in scripts/templates`)
        log("Go to the scripts folder and start customizing them!")
      });
    } else {
      log("");
      log(`Added script to project, to run npm run ${name}`)
      log("Go to the scripts folder and start customizing it!")
      process.exit();
    }
  });
};

let checkScriptsFolderExists = () => {
  console.clear()
  try {
    if (fs.existsSync("./scripts")) {
      if (!fs.existsSync("./scripts/templates")) {
        helpers.mkdirSync("scripts/templates");
      }
    } else {
      helpers.mkdirSync("scripts");
      helpers.mkdirSync("scripts/templates");
    }
  } catch (err) {
    console.error("Could not create scripts and scripts/templates folder. Here is the error: ", err)
  }
};

module.exports = scripts;
