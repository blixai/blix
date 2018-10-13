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

  it("Does not create testing files if enzyme is not selected", () => {
    installReactTesting()
    expect(fs.readdirSync(`${store.name}/test`)).toHaveLength(0)
  })
  it("Creates a spec file if testing is selected", () => {
    store.reactTesting = { enzyme: true }
    store.reactType === "react-router"
    installReactTesting()
    expect(fs.readdirSync(`${store.name}/test`)).toHaveLength(1)
  })

  describe("Dynamically creates and sets up Testing files", () => {
    beforeAll(() => {
      try {
        store.reactTesting = { enzyme: true }
      } catch(err){
        console.error(err)
      }
    })
    afterEach(() => {
      store.reactType = ""
      store.devDependencies = ""
    })

    it("Creates a Router file if react-router", () => {
      store.reactType = "react-router"
      installReactTesting()
      expect(exists(`${store.name}/test/Router.spec.js`)).toBe(true)
    })
    it("Creates a Router file if reactRouterRedux", () => {
      store.reactType = "reactRouterRedux"
      installReactTesting()
      expect(exists(`${store.name}/test/Router.spec.js`)).toBe(true)
    })
    it("Creates App.spec.js if no react Type Selected", () => {
      installReactTesting()
      expect(exists(`${store.name}/test/App.spec.js`)).toBe(true)
    })
    
    // check store.devDependencies
    it("Adds dev dependencies to the store", () => {
      installReactTesting()
      expect(store.devDependencies).toContain("jest enzyme enzyme-adapter-react-16 identity-obj-proxy babel-jest 'babel-core@^7.0.0-0'")
    })

  
    it("Adds Jest to package.json", () => {
      let json = JSON.parse(fs.readFileSync(`./${store.name}/package.json`, "utf8"));
      expect(json.scripts.test).toContain("jest")
    })
  })
})