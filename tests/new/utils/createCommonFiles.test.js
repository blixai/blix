jest.mock('fs', () => ({
  existsSync: jest.fn(),
}))

jest.mock('child_process', () => {
  execSync: jest.fn()
})

const fs = require('fs')
const child_process = require('child_process')
const store = require('../../../new/store') 
const helpers = require("../../../helpers")
const {createCommonFilesAndFolders} = require('../../../new/utils/createCommonFiles')
  
describe("Create Common Files", () => {

  describe('Utils: createCommonFiles', () => {

    it.skip('creates source directory that matches the store name', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()
      mockMkDir.mockReturnValue(true)
      const spy = jest.spyOn(process, 'chdir').mockImplementation(() => {
        return
      })
      expect().toBe(true);
    });

    it.skip('Initalizes a new Git Repository', () => {
      expect(exists(`${store.name}/.git`)).toBe(true);
    });

    it.skip('Contains common files', () => {
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
})