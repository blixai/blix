const fs = require('fs');
const exists = fs.existsSync;
const store = require('../../../new/store');
const helpers = require('../../../helpers')
const { writeFile} = helpers
const path = require("path");
const readFile = fs.readFileSync;
const {
  installReactTesting
} = require('../../../new/utils/addReactTesting');
const execSync = require("child_process").execSync;

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8")
}

beforeAll(() => {
  try{
    store.name = "testApp";
    store.env = "development";
    fs.mkdirSync(store.name);
    let pkgJson = loadFile('../../../new/files/common/package.json')
    writeFile(`package.json`, pkgJson)
    fs.mkdirSync(`${store.name}/test`);
  } catch(err){
    console.error(err)
  }
})

afterAll(() => {
  try{
    execSync(`rm -rf ${store.name}`)
  } catch(err){
    console.error(err)
  }
})

describe("Add React Testing", () => { 

  describe("Check if user selects React Testing", () => {

    it("Does not create testing files if enzyme is not selected", () => {
      installReactTesting()
      expect(fs.readdirSync(`${store.name}/test`)).toHaveLength(0)
    })

    it("Creates testging files if enzyme is selected", () => {
      // store.reactTesting = { enzyme: true } 

    })

    // check store.reactType
      // if react-router
        // store.name/test/Router.spec.js exist?
      // if reactRouter-redux
        // store.name/test/Router.spec.js exist?
      // if store.reactType !== 'react-router' && store.reactType !== 'reactRouter-redux'
        // store.name/test/App.spec.js exist?
    
    // check store.devDependencies
      // does it include jest enzyme enzyme-adapter-react-16 identity-obj-proxy
    

    // check package.json
      // does jest include moduleNameMapper
      // does scripts.test === jest
    })
})