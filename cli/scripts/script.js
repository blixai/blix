const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const helpers = require("../../dist/src");
const addAPIScript = require('../new/utils/addAPIScript')

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
    },
    {
      name: "api: create axios requests to a resource quickly",
      value: "api"
    }
  ]
};

const custom = {
  type: "input",
  message: "What do you want to name this script:",
  name: "custom"
};

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


const scripts = async () => {
  console.clear();
  let answer = await prompt([commands])

  switch (answer.commands) {
    case "react":
      this.addReact();
      break;
    case "redux":
      this.addRedux();
      break;
    case "controller":
      this.addController();
      break;
    case "model":
      this.addModel();
      break;
    case "action":
      this.addAction();
      break;
    case "view":
      this.addClientView()
      break;
    case "api":
      this.addAPI()
      break;
    case "custom":
      let customSelection = await prompt([custom])
      this.createNewScript(customSelection.custom);
      break;
    default:
      console.log("Something went wrong. Please try again");
      break;
  }
};

exports.scripts = scripts


exports.addAction = () => {
  helpers.addScriptToPackageJSON("action", "node scripts/action.js");
  helpers.checkScriptsFolderExist()

  let action = loadFile("frontend/redux/action.js");
  let actionTemplate = loadFile("frontend/redux/templates/action.js");
  let reducerTemplate = loadFile("frontend/redux/templates/reducer.js");

  helpers.writeFile("scripts/action.js", action);
  helpers.writeFile("scripts/templates/action.js", actionTemplate);
  helpers.writeFile("scripts/templates/reducer.js", reducerTemplate);

  console.log("")
  console.log("Added script to project, to run: npm run action")
  console.log("This will prompt for the actions name, and the reducers name")
  console.log("From there it will create the action in src/action/index.js and if the reducer already exists add it to that reducer or create a reducer with that action in src/reducers.")
  console.log("If the reducer is created it will also be added to the rootReducer.js file in src/reducers")
  console.log("You will then be prompted with an array of containers from src/components/ that the action should be added to, enter each container (case-sensitive)")
  console.log("The action will then be imported into each selected container and added to each containers mapDispatchToProps.")
};


const addModel = async () => {
  helpers.addScriptToPackageJSON("model", "node scripts/model.js");
  helpers.checkScriptsFolderExist();

  let ans = await prompt([model])
  
  if (ans.model === "m") {
    // add moongoose
    let model = loadFile("backend/mongoose.js");
    let schemaTemplate = loadFile("backend/templates/mongoose.js");

    helpers.writeFile("scripts/model.js", model);
    helpers.writeFile("scripts/templates/schemaTemplate.js", schemaTemplate);
    console.log("")
    console.log("Added script to project, to run: npm run model <name>")
    console.log("This creates a new model in server/models")
    console.log("This script accepts arguments to create a schema: npm run model <name> email friends:Array pin:Number")
    console.log("To view all valid data types go to scripts/model.js and search for 'validSchemas'")
  } else {
    // add bookshelf
    // load file for server/models/bookshelf.js 
    let bookshelfRequiredFile = loadFile("backend/templates/bookshelf.js");
    // load scripts files 
    let migration = loadFile("backend/templates/migration.js");
    let bookshelf = loadFile("backend/templates/bookshelf.js");
    let model = loadFile(
      "backend/bookshelf.js"
    );
    // create files 
    helpers.writeFile("scripts/model.js", model);
    helpers.writeFile("scripts/templates/migration.js", migration);
    helpers.writeFile("scripts/templates/bookshelf.js", bookshelf);
    // bookshelf required file needs to be placed inside the project, preferably the models folder
    helpers.writeFile("server/models/bookshelf.js", bookshelfRequiredFile);
    console.log("")
    console.log("Added script to project, to run: npm run model <name>")
    console.log("This creates a new model in server/models, and new migration in db/migrations ")
    console.log("This script accepts arguments to create a schema: npm run model <name> email:string admin:boolean loggedIn:dateTime")
    console.log("To view all valid data types go to scripts/model.js and search for 'possibleFields'")
  }
};

exports.addModel = addModel


exports.addReact = () => {
  // always add script first because if there is no package.json it'll process.exit()
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  helpers.checkScriptsFolderExist();

  let react = loadFile("frontend/react/component.js");
  helpers.writeFile("scripts/component.js", react);
  this.checkReactTemplatesExist()

  console.log("")
  console.log("Added script to project, to run: npm run component <name>")
  console.log("This will create a stateless or stateful component in a folder <name> within src/")
};


exports.addRedux = () => {
  helpers.addScriptToPackageJSON("component", "node scripts/component.js");
  helpers.checkScriptsFolderExist();

  // load component script and templates 
  this.checkReactTemplatesExist()

  let redux = loadFile("frontend/redux/component.js");
  let container = loadFile("frontend/redux/templates/container.js");
  // write files
  helpers.writeFile("scripts/component.js", redux);
  helpers.writeFile("scripts/templates/container.js", container);

  console.log("")
  console.log("Added script to project, to run: npm run component <name>")
  console.log("This will create a stateless or stateful component with a redux container in src/components")
};


exports.addClientView = () => {
  helpers.addScriptToPackageJSON("view", "node scripts/view.js")
  helpers.checkScriptsFolderExist()
  this.checkReactTemplatesExist()

  // if true project uses redux
  if (fs.existsSync('./src/store')) {
    let reduxViewScript = loadFile("frontend/redux/view.js")
    helpers.writeFile("scripts/view.js", reduxViewScript)

    console.log("")
    console.log("Added script to project, to run: npm run view <name>")
    console.log("This will create a new stateless or stateful component in src/views and ask which components/containers to import into the view. It will also ask for a route path for the view and add this view with it's route into the App.js file.")
    console.log("If view already exists it will just ask what containers/components from src/components to import into that view.")
  } else {
    let reactRouterViewScript = loadFile("frontend/react-router/view.js")
    helpers.writeFile("scripts/view.js", reactRouterViewScript)

    console.log("")
    console.log("Added script to project, to run: npm run view <name>")
    console.log("This will create a new stateless or stateful component in src/views and ask which components to import into the view. It will also ask for a route path for the view and add this view with it's route into the App.js file.")
    console.log("If view already exists it will just ask what components from src/components to import into that view.")
  }
}


// make sure react component templates exist and if not create them 
exports.checkReactTemplatesExist = () => {
  try {
    fs.readFileSync('./scripts/templates/statefulComponent.js', 'utf8')
    fs.readFileSync('./scripts/templates/statelessComponent.js', 'utf8')
  } catch (err) {
    let statefulComponent = loadFile("frontend/react/templates/statefulComponent.js")
    let statelessComponent = loadFile("frontend/react/templates/statelessComponent.js")

    helpers.writeFile("scripts/templates/statefulComponent.js", statefulComponent)
    helpers.writeFile("scripts/templates/statelessComponent.js", statelessComponent)
  }
}


exports.addController = () => {
  helpers.addScriptToPackageJSON("controller", "node scripts/controller.js");
  helpers.checkScriptsFolderExist();

  let controller = loadFile("backend/controller.js");
  let controllerTemplate = loadFile("backend/templates/controller.js");
  let routes = loadFile("backend/templates/routes.js");

  helpers.writeFile("scripts/controller.js", controller);
  helpers.writeFile("scripts/templates/controller.js", controllerTemplate);
  helpers.writeFile("scripts/templates/routes.js", routes);

  console.log("")
  console.log("Added script to project, to run: npm run controller <name>")
  console.log("This will create a controller in server/controllers and add the associated GET/PUT/DELETE/POST routes to server/routes.js")
};


const createNewScript = async name => {
  helpers.addScriptToPackageJSON(name, `node scripts/${name}.js`);
  helpers.checkScriptsFolderExist();
  helpers.writeFile(`scripts/${name}.js`, "");
  
  let a = await prompt([template])
  a = a.template;
  if (a) {
    let ans = await prompt([templateName])
    ans = ans.templateName;
    let importTemplate = fs.readFileSync(path.resolve(__dirname, './templates/customScript.js'), 'utf8');
    importTemplate = importTemplate.replace(/Name/g, ans)
    helpers.appendFile(`./scripts/${name}.js`, importTemplate)
    helpers.writeFile(`scripts/templates/${ans}.js`, "");

    console.log("");
    console.log(`Added script to project, to run npm run ${name}`)
    console.log(`Created template ${ans} in scripts/templates`)
    console.log("Go to the scripts folder and start customizing them!")
  } else {
    console.log("");
    console.log(`Added script to project, to run: npm run ${name}`)
    console.log("Go to the scripts folder and start customizing it!")
  }
};

exports.createNewScript = createNewScript

exports.addAPI = () => {
  helpers.checkScriptsFolderExist()

  addAPIScript()

  console.log("")
  console.log("Added script to project, to run: npm run api <resource>")
  console.log("This will create a file with several basic axios requests in src/api/<resource>.js")
}
