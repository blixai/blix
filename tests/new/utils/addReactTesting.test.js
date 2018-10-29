const fs = require('fs');
const exists = fs.existsSync;
const store = require('../../../new/store');
const helpers = require('../../../helpers')
jest.mock('../../../helpers')
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}))

const {
  installReactTesting
} = require('../../../new/utils/addReactTesting');

describe("Add React Testing", () => {

  beforeAll(() => {
    store.reactTesting = ''
    store.reactType = ""
    store.devDependencies = ""
    fs.readFileSync.mockReturnValue('{ "scripts": {} }')
  })

  it("Does not create testing files if enzyme is not selected", () => {
    installReactTesting()

    expect(helpers.addDependenciesToStore).not.toBeCalled()
  })

  it("Creates a spec file if testing is selected", () => {
    store.reactTesting = {enzyme: true}
    installReactTesting()

    expect(helpers.writeFile).toBeCalled()
  })

  it("creates a router test file if reactType is react-router", () => {
    store.reactTesting = {enzyme: true}
    store.reactType = "react-router"
    fs.readFileSync.mockReturnValueOnce('enzyme')

    installReactTesting()

    expect(helpers.writeFile).toBeCalledWith('test/Router.spec.js', 'enzyme')
  })

  it("creates a router test file if reactType is reactRouter-redux", () => {
    store.reactTesting = {enzyme: true}
    store.reactType = "reactRouter-redux"
    fs.readFileSync.mockReturnValueOnce('enzyme')
    installReactTesting()

    expect(helpers.writeFile).toBeCalledWith('test/Router.spec.js', 'enzyme')
  })


  it("creates app test file if react type doesn't use a router", () => {
    store.reactTesting = {enzyme: true}
    store.reactType = "react"
    fs.readFileSync.mockReturnValueOnce('enzyme')
    installReactTesting()

    expect(helpers.writeFile).toBeCalledWith('test/App.spec.js', 'enzyme')
  })

  // check store.devDependencies
  it("adds dev dependencies to the store", () => {
    store.reactTesting = {enzyme: true}
    store.reactType = "react"
    installReactTesting()

    expect(helpers.addDevDependenciesToStore).toBeCalledWith("jest enzyme enzyme-adapter-react-16 identity-obj-proxy babel-jest 'babel-core@^7.0.0-0'")
  })


  it("adds jest to package.json", () => {
    store.name = 'test'
    store.reactTesting = {enzyme: true}
    store.reactType = "react"

    installReactTesting()

    expect(helpers.addScriptToPackageJSON).toBeCalledWith('test', 'jest')
    expect(fs.writeFileSync.mock.calls[0][0]).toEqual('./test/package.json')
    expect(fs.writeFileSync.mock.calls[0][1]).toContain('jest')
  })
})