const fs = require('fs');
const exists = fs.existsSync;
const store = require('../../../new/store');
const helpers = require('../../../helpers')
const { writeFile, mkdirSync } = helpers
const path = require("path");
const readFile = fs.readFileSync;
const {
  addMongooseToScripts,
  addMongoDBToProject,
} = require('../../../new/utils/addMongoDB');
const execSync = require("child_process").execSync;

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8")
}

beforeAll(() => {
  try{
    process.chdir('./tests/new/utils')
    store.name = "tmpTest"
    store.env = "development"
    fs.mkdirSync(store.name)
    let pkgJson = loadFile('../../../new/files/common/package.json')
    helpers.writeFile('package.json', pkgJson)
    const files = [
      "server/server.js",
      ".env"
    ]
    const folders = [
      "scripts",
      "scripts/templates",
      "server"
    ]

    folders.forEach(folder => {
      mkdirSync(`${folder}`)
    })
    files.forEach(file => {
      writeFile(`${file}`)
    })
  } catch(err){
    console.error(err)
  }
})

afterAll(() => {
  execSync(`rm -rf ${store.name}`)
})

describe("Utils: addMongooseToScripts", () => {
  beforeAll(() => {
    addMongooseToScripts();
  })

  it("Contains model.js", () => {
    expect(exists(`${store.name}/scripts/model.js`)).toBe(true);
  });

  it("Contains schemaTemplate.js", () => {
    expect(exists(`${store.name}/scripts/templates/schemaTemplate.js`)).toBe(true);
  });
})
  

describe("Utils: addMongoDBToProject", () => {
  beforeAll(() => {
    addMongoDBToProject();
  })

  it("Adds mongoose to server.js", () => {
    expect(readFile(`${store.name}/server/server.js`, "utf8")).toContain("require('mongoose')")
  })

  it("Adds the Mongo connection string to .env", () => {
    expect(readFile(`${store.name}/.env`, "utf8")).toContain(`mongodb://localhost:27017/${store.name}`)
  })

  it("Adds mongo and mongoose to the store devDependencies", () => {
    expect(store.dependencies).toContain("mongo mongoose")
  })
})