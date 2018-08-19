let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let name;
const helpers = require('../../helpers')
const fs = require('fs')
const path = require('path')

const { createCommonFilesAndFolders } = require("../../new/utils/createCommonFiles");
const { testBackend } = require("../../new/utils/addBackendTests");
const { addMongooseToScripts } = require("../../new/utils/addMongoDB");
const { addBookshelfToScripts } = require("../../new/utils/addBookshelf");

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const {
  serverTesting,
  database,
  backendType
} = require('../../new/prompts')

let addBackend = async () => {
  let mode = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  let databaseSelection = await prompt([database])
  createBackend(mode, serverTestingSelection, databaseSelection)
}


// load files 
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  try {
    fs.mkdirSync('./server')
  } catch (err) {
    console.error('Server folder already exists')
    process.exit(1)
  }
  fs.mkdirSync('./server/models')
  fs.mkdirSync('./server/controllers')
  fs.mkdirSync('./server/helpers')
  if (mode !== 'api') {
    try {
      fs.mkdirSync('./assets')
    } catch (err) {
      console.error('Tried to create assets folder but one already exists')
    }
  }

  helpers.writeFile('./server/routes.js', routes)
  helpers.writeFile('./server/cluster.js', cluster)

  mode.mode === "standard" ? standard() : mode === "mvc" ? mvc() : api();
}

const standard = () => {
  const html = loadFile('frontend/other/index.html')
  const server = loadFile('backend/backend/server.js')
  const controller = loadFile('backend/backend/home.js')

  helpers.writeFileSync('./server/server.js', server)
  helpers.writeFile('./server/controllers/home.js', controller)
  fs.mkdirSync('./server/views')
  fs.mkdirSync('./server/views/home')
  helpers.writeFile('./server/views/home/index.html', html)
}

const mvc = () => {
  const server = loadFile('backend/mvc/server.js')
  const error = loadFile('backend/mvc/error.pug')
  const layout = loadFile('backend/mvc/layout.pug')
  const pug = loadFile('backend/mvc/index.pug')

  helpers.writeFileSync('./server/server.js', server)
  fs.mkdirSync('./server/views')
  helpers.writeFile('./server/views/error.pug', error)
  helpers.writeFile('./server/views/layout.pug', layout)
  fs.mkdirSync('./server/views/home')
  helpers.writeFile('./server/views/home/index.pug', pug)
}

const api = () => {
  const server = loadFile('backend/api/server.js')
  const homeController = loadFile('backend/api/home.js')

  helpers.writeFileSync('./server/server.js', server)
  helpers.writeFile('./server/controllers/home.js', homeController)
}

const packages = mode => {
  if (mode === "backend") {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan cookie-parser"
    );
  } else if (mode === "mvc") {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan cookie-parser pug"
    );
  } else {
    helpers.install(
      "express nodemon body-parser compression helmet dotenv morgan"
    );
  }
};

const addDatabase = databaseSelection => {
  if (databaseSelection.database === "mongo") {
    addMongooseToScripts();
  } else if (databaseSelection.database === "pg") {
    addBookshelfToScripts();
  }
};

const scripts = mode => {
  helpers.addScriptToNewPackageJSON("start", "nodemon server/cluster.js");
  // controller script
  helpers.addScriptToNewPackageJSON("controller", "node scripts/controller.js");
  helpers.writeFile(
    `./${name}/scripts/controller.js`,
    loadFile("./files/scripts/backend/controller.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/controller.js`,
    loadFile("./files/scripts/backend/templates/controller.js")
  );
  helpers.writeFile(
    `./${name}/scripts/templates/routes.js`,
    loadFile("./files/scripts/backend/templates/routes.js")
  );
};

let setupTesting = test => {
  if (test === "mocha") {
    mochaChia();
  } else if (test === "jest") {
    jest();
  }
};

let mochaChia = () => {
  helpers.addScriptToNewPackageJSON("test", "mocha", name);
  fs.mkdirSync(`./${name}/test`);
  helpers.writeFile(
    `./${name}/test/test.js`,
    loadFile("./files/testing/backend/mocha.js")
  );
};

let jest = () => {
  helpers.addScriptToNewPackageJSON("test", "jest", name);
  if (!fs.existsSync(`./${name}/test/server`)) {
    fs.mkdirSync(`./${name}/test/server`);
  }
  helpers.writeFile(
    `./${name}/test/server/test.test.js`,
    loadFile("./files/testing/backend/jest.js")
  );
};



module.exports = addBackend
