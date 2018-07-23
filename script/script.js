const fs = require("fs");
const path = require("path");
const log = console.log;
const inquirer = require("inquirer");
const prompt = inquirer.prompt;
const helpers = require("../helpers");

// helper function to load files
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const commands = {
  type: "list",
  message: "Add a blix command to a project:",
  pageSize: 10,
  name: "commands",
  choices: [
    { name: "custom: create your own", value: "custom" },
    {
      name: "react: create a new react statefull or stateless component",
      value: "react"
    },
    {
      name:
        "redux: create a new react component, a redux container, and a new route in your routing component",
      value: "redux"
    },
    { name: "api: create new api endpoints and controller", value: "api" },
    {
      name:
        "page: create a new folder, html or pug, css, and js files along with adding the route in routes.js",
      value: "page"
    },
    {
      name:
        "model: create a new Bookshelf model and migration or a Mongoose model",
      value: "model"
    },
    {
      name: "action: create or add redux action to new or existing reducer",
      value: "action"
    }
  ]
};

const custom = {
  type: "input",
  message: "What do you want to name this command:",
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

const page = {
  type: "list",
  message: "Use Pug or Html",
  name: "page",
  choices: [{ name: "Pug" }, { name: "Html" }]
};

const command = () => {
  console.clear();

  prompt([commands]).then(answer => {
    switch (answer.commands) {
      case "react":
        addReact();
        break;
      case "redux":
        addRedux();
        break;
      case "api":
        addAPI();
        break;
      case "page":
        addPage();
        break;
      case "model":
        addModel();
        break;
      case "action":
        addAction();
        break;
      case "custom":
        prompt([custom]).then(custom => {
          createNew(custom.custom);
        });
        break;
      default:
        log("Something went wrong. Please try again");
        break;
    }
  });
};

const addAction = () => {
  helpers.addScript("action", "node scripts/action.js");
  checkEnzoExists();

  let action = loadFile("./files/enzoCreateAction.js");
  let actionTemplate = loadFile("./templates/actionTemplate.js");
  let reducerTemplate = loadFile("./templates/reducerTemplate.js");

  helpers.writeFile("./scripts/action.js", action);
  helpers.writeFile("./scripts/templates/actionTemplate.js", actionTemplate);
  helpers.writeFile("./scripts/templates/reducerTemplate.js", reducerTemplate);
};

const addModel = () => {
  helpers.addScript("model", "node scripts/model.js");
  prompt([model]).then(ans => {
    if (ans.model === "m") {
      // add moongoose
      checkEnzoExists();
      let model = loadFile("./templates/enzoCreateMongooseModel.js");
      let schemaTemplate = loadFile("./templates/schemaTemplate.js");

      helpers.writeFile("./scripts/model.js", model, "Created model file in blix");
      helpers.writeFile(
        "./scripts/templates/schemaTemplate.js",
        schemaTemplate,
        "Created Mongoose schema template in scripts/templates"
      );
    } else {
      // add bookshelf
      checkEnzoExists();
      let model = loadFile("./templates/enzoCreateBookshelfModel.js");
      let migrationTemplate = loadFile("./templates/migrationTemplate.js");
      let bookshelf = loadFile("./templates/bookshelf.js");
      let enzoBookshelfModelTemplate = loadFile(
        "./templates/enzoBookshelfModelTemplate.js"
      );

      helpers.writeFile("./scripts/model.js", model, "Created model file in scripts");
      helpers.writeFile(
        "./scripts/templates/migrationTemplate.js",
        migrationTemplate,
        "Created knex migration template in scripts/templates"
      );
      helpers.writeFile(
        "./scripts/templates/enzoBookshelfModelTemplate.js",
        enzoBookshelfModelTemplate,
        "Created Bookshelf template file in scripts/templates"
      );

      try {
        fs.writeFileSync("./server/models/bookshelf.js", bookshelf);
        log("Created Bookshelf file in server/models/bookshelf.js");
      } catch (e) {
        log(
          `Failed to create a bookshelf.js file in server/models. You'll need to create this yourself.`
        );
      }
    }
  });
};

let addReact = () => {
  // always add script first because if there is no package.json it'll process.exit()
  helpers.addScript("react", "node scripts/react.js");
  let react = loadFile("./files/scriptsReact.js");
  let stateful = loadFile("./templates/statefulComponent.js");
  let stateless = loadFile("./templates/statelessComponent.js");
  checkscriptsExists();
  helpers.writeFile("./scripts/react.js", react);
  helpers.writeFile("./scripts/templates/statefulComponent.js", stateful);
  helpers.writeFile("./scripts/templates/statelessComponent.js", stateless);
};

let addRedux = () => {
  helpers.addScript("redux", "node scripts/redux.js");

  let redux = loadFile("./files/enzoCreateContainer.js");
  let enzoDumbComponentTemplate = loadFile(
    "./templates/enzoDumbComponentTemplate.js"
  );
  let dumbReduxContainerTemplate = loadFile(
    "./templates/dumbReduxContainerTemplate.js"
  );
  let smartComponentTemplate = loadFile(
    "./templates/smartComponentTemplate.js"
  );
  let reduxContainerTemplate = loadFile(
    "./templates/reduxContainerTemplate.js"
  );

  checkEnzoExists();

  helpers.writeFile("./scripts/redux.js", redux);
  helpers.writeFile(
    "./scripts/templates/enzoDumbComponentTemplate.js",
    enzoDumbComponentTemplate
  );
  helpers.writeFile(
    "./scripts/templates/dumbReduxContainerTemplate.js",
    dumbReduxContainerTemplate
  );
  helpers.writeFile(
    "./scripts/templates/smartComponentTemplate.js",
    smartComponentTemplate
  );
  helpers.writeFile(
    "./scripts/templates/reduxContainerTemplate.js",
    reduxContainerTemplate
  );
};

let addAPI = () => {
  helpers.addScript("api", "node scripts/api.js");

  let api = loadFile("./files/enzoCreateAPI.js");
  let enzoControllerTemplate = loadFile(
    "./templates/enzoControllerTemplate.js"
  );
  let enzoEndpointTemplate = loadFile("./templates/enzoEndpointTemplate.js");

  checkEnzoExists();

  helpers.writeFile("./scripts/api.js", api);
  helpers.writeFile(
    "./scripts/templates/enzoControllerTemplate.js",
    enzoControllerTemplate
  );
  helpers.writeFile(
    "./scripts/templates/enzoEndpointTemplate.js",
    enzoEndpointTemplate
  );
};

let addPage = () => {
  prompt([page]).then(page => {
    helpers.addScript("page", "node scripts/page.js");
    page.page === "Pug" ? pugPage() : htmlPage();
  });
};

let pugPage = () => {
  let page = loadFile("./files/enzoPugPage.js");
  let template = loadFile("./templates/pugTemplate.pug");
  checkEnzoExists();
  helpers.writeFile("./scripts/page.js", page);
  helpers.writeFile("./scripts/templates/pugTemplate.pug", template);
};

let htmlPage = () => {
  let page = loadFile("./files/enzoNewPage.js");
  let html = loadFile("./templates/htmlPageTemplate.html");
  checkEnzoExists();
  helpers.writeFile("./scripts/page.js", page);
  helpers.writeFile("./scripts/templates/htmlPageTemplate.html", html);
};

let createNew = name => {
  helpers.addScript(name, `node scripts/${name}.js`);
  checkEnzoExists();
  helpers.writeFile(`./scripts/${name}.js`, "");
  prompt([template]).then(a => {
    a = a.template;
    if (a) {
      prompt([templateName]).then(ans => {
        ans = ans.templateName;
        let importTemplate = `let fs = require('fs')\nlet path = require('path')\n\nlet ${ans}Template = fs.readFileSync(path.resolve(__dirname, './templates/${ans}.js'), 'utf8')`;
        fs.appendFile(`./scripts/${name}.js`, importTemplate, err => {
          if (err) console.error(err);
          log(`Imported the template ${ans} into scripts/${name}.js`);
        });
        fs.writeFileSync(`./scripts/templates/${ans}.js`, "", "utf8");
        log("Done!");
      });
    } else {
      log("Done!");
      process.exit();
    }
  });
};

let checkEnzoExists = () => {
  if (fs.existsSync("./scripts")) {
    if (fs.existsSync("./scripts/templates")) {
      return;
    } else {
      fs.mkdirSync("./scripts/templates");
    }
  } else {
    fs.mkdirSync("./scripts");
    fs.mkdirSync("./scripts/templates");
  }
};

module.exports = command;
