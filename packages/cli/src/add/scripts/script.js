const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const addAPIScript = require('../new/utils/addAPIScript')
const {
  loadFile,
  writeFile,
  checkScriptsFolderExist,
  addScriptToPackageJSON,
  appendFile
} = require('@blix/core')

// helper function to load files
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
  addScriptToPackageJSON("action", "node scripts/action.js");
  checkScriptsFolderExist()

  let action = loadFile("scripts/frontend/redux/action.js");
  let actionTemplate = loadFile("scripts/frontend/redux/templates/action.js");
  let reducerTemplate = loadFile("scripts/frontend/redux/templates/reducer.js");

  writeFile("scripts/action.js", action);
  writeFile("scripts/templates/action.js", actionTemplate);
  writeFile("scripts/templates/reducer.js", reducerTemplate);

  console.log("")
  console.log("Added script to project, to run: npm run action")
  console.log("This will prompt for the actions name, and the reducers name")
  console.log("From there it will create the action in src/action/index.js and if the reducer already exists add it to that reducer or create a reducer with that action in src/reducers.")
  console.log("If the reducer is created it will also be added to the rootReducer.js file in src/reducers")
  console.log("You will then be prompted with an array of containers from src/components/ that the action should be added to, enter each container (case-sensitive)")
  console.log("The action will then be imported into each selected container and added to each containers mapDispatchToProps.")
};


const addModel = async () => {
  addScriptToPackageJSON("model", "node scripts/model.js");
  checkScriptsFolderExist();

  let ans = await prompt([model])
  
  if (ans.model === "m") {
    // add moongoose
    let model = loadFile("scripts/backend/mongoose.js");
    let schemaTemplate = loadFile("scripts/backend/templates/mongoose.js");

    writeFile("scripts/model.js", model);
    writeFile("scripts/templates/schemaTemplate.js", schemaTemplate);
    console.log("")
    console.log("Added script to project, to run: npm run model <name>")
    console.log("This creates a new model in server/models")
    console.log("This script accepts arguments to create a schema: npm run model <name> email friends:Array pin:Number")
    console.log("To view all valid data types go to scripts/model.js and search for 'validSchemas'")
  } else {
    // add bookshelf
    // load file for server/models/bookshelf.js 
    let bookshelfRequiredFile = loadFile("scripts/backend/templates/bookshelf.js");
    // load scripts files 
    let migration = loadFile("scripts/backend/templates/migration.js");
    let bookshelf = loadFile("scripts/backend/templates/bookshelf.js");
    let model = loadFile(
      "backend/bookshelf.js"
    );
    // create files 
    writeFile("scripts/model.js", model);
    writeFile("scripts/templates/migration.js", migration);
    writeFile("scripts/templates/bookshelf.js", bookshelf);
    // bookshelf required file needs to be placed inside the project, preferably the models folder
    writeFile("server/models/bookshelf.js", bookshelfRequiredFile);
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
  addScriptToPackageJSON("component", "node scripts/component.js");
  checkScriptsFolderExist();

  let react = loadFile("scripts/frontend/react/component.js");
  writeFile("scripts/component.js", react);
  this.checkReactTemplatesExist()

  console.log("")
  console.log("Added script to project, to run: npm run component <name>")
  console.log("This will create a stateless or stateful component in a folder <name> within src/")
};


exports.addRedux = () => {
  addScriptToPackageJSON("component", "node scripts/component.js");
  checkScriptsFolderExist();

  // load component script and templates 
  this.checkReactTemplatesExist()

  let redux = loadFile("scripts/frontend/redux/component.js");
  let container = loadFile("scripts/frontend/redux/templates/container.js");
  // write files
  writeFile("scripts/component.js", redux);
  writeFile("scripts/templates/container.js", container);

  console.log("")
  console.log("Added script to project, to run: npm run component <name>")
  console.log("This will create a stateless or stateful component with a redux container in src/components")
};


exports.addClientView = () => {
  addScriptToPackageJSON("view", "node scripts/view.js")
  checkScriptsFolderExist()
  this.checkReactTemplatesExist()

  // if true project uses redux
  if (fs.existsSync('./src/store')) {
    let reduxViewScript = loadFile("scripts/frontend/redux/view.js")
    writeFile("scripts/view.js", reduxViewScript)

    console.log("")
    console.log("Added script to project, to run: npm run view <name>")
    console.log("This will create a new stateless or stateful component in src/views and ask which components/containers to import into the view. It will also ask for a route path for the view and add this view with it's route into the App.js file.")
    console.log("If view already exists it will just ask what containers/components from src/components to import into that view.")
  } else {
    let reactRouterViewScript = loadFile("scripts/frontend/react-router/view.js")
    writeFile("scripts/view.js", reactRouterViewScript)

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
    let statefulComponent = loadFile("scripts/frontend/react/templates/statefulComponent.js")
    let statelessComponent = loadFile("scripts/frontend/react/templates/statelessComponent.js")

    writeFile("scripts/templates/statefulComponent.js", statefulComponent)
    writeFile("scripts/templates/statelessComponent.js", statelessComponent)
  }
}


exports.addController = () => {
  addScriptToPackageJSON("controller", "node scripts/controller.js");
  checkScriptsFolderExist();

  let controller = loadFile("scripts/backend/controller.js");
  let controllerTemplate = loadFile("scripts/backend/templates/controller.js");
  let routes = loadFile("scripts/backend/templates/routes.js");

  writeFile("scripts/controller.js", controller);
  writeFile("scripts/templates/controller.js", controllerTemplate);
  writeFile("scripts/templates/routes.js", routes);

  console.log("")
  console.log("Added script to project, to run: npm run controller <name>")
  console.log("This will create a controller in server/controllers and add the associated GET/PUT/DELETE/POST routes to server/routes.js")
};


const createNewScript = async name => {
  addScriptToPackageJSON(name, `node scripts/${name}.js`);
  checkScriptsFolderExist();
  writeFile(`scripts/${name}.js`, "");
  
  let a = await prompt([template])
  a = a.template;
  if (a) {
    let ans = await prompt([templateName])
    ans = ans.templateName;
    let importTemplate = fs.readFileSync(path.resolve(__dirname, './templates/customScript.js'), 'utf8');
    importTemplate = importTemplate.replace(/Name/g, ans)
    appendFile(`./scripts/${name}.js`, importTemplate)
    writeFile(`scripts/templates/${ans}.js`, "");

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
  checkScriptsFolderExist()

  addAPIScript()

  console.log("")
  console.log("Added script to project, to run: npm run api <resource>")
  console.log("This will create a file with several basic axios requests in src/api/<resource>.js")
}
