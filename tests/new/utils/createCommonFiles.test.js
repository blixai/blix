const store = require('../../../new/store') 
const fs = require('fs')
const exists = fs.existsSync
const helpers = require("../../../helpers")
const execSync = require('child_process').execSync
const {createCommonFilesAndFolders} = require('../../../new/utils/createCommonFiles')

beforeAll(() => {
  try {
    // sets store.name
    store.name = "TestApp"
    store.env = "development"
    process.chdir('./tests/new/utils')
  } catch (err) {
    console.error(err)
  }
})
  
describe('Utils: createCommonFiles', () => {
  beforeAll(() => {
    try {
      createCommonFilesAndFolders();
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(() => {
    try { 
      execSync(`rm -rf ${store.name}`)
    } catch (err) {
      console.log(err)
    }
  });

  it('creates source directory that matches the store name', () => {
    expect(exists(store.name)).toBe(true);
  });

  it('Initalizes a new Git Repository', () => {
    expect(exists(`${store.name}/.git`)).toBe(true);
  });

  it('Contains common files', () => {
    const commonFiles = [
      ".gitignore",
      "README.md",
      "package.json",
      ".env",
      "scripts",
      "scripts/templates",
      "test"
    ]
    commonFiles.forEach(file => {
      expect(exists(`${store.name}/${file}`)).toBe(true)
    })
  })
});
