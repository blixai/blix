const store = require('../../../new/store');
const helpers = require('../../../helpers')
const {
  addMongooseToScripts,
  addMongoDBToProject,
} = require('../../../new/utils/addMongoDB');
const addMongoDb = require('../../../new/utils/addMongoDB')


describe('Add Mongo DB', () => {
  describe("addMongooseToScripts", () => {

    it('creates model.js and schemaTemplate.js', () => {
      const mockWrite = helpers.writeFile = jest.fn()
      addMongoDb.addMongoDBToProject = jest.fn()
      helpers.addScriptToNewPackageJSON = jest.fn()

      addMongooseToScripts()

      expect(mockWrite).toBeCalled()
      expect(mockWrite).toBeCalledTimes(2)
      expect(mockWrite.mock.calls[0][0]).toEqual('scripts/model.js')
      expect(mockWrite.mock.calls[0][1]).not.toEqual(undefined)
      expect(mockWrite.mock.calls[1][0]).toEqual('scripts/templates/schemaTemplate.js')
      expect(mockWrite.mock.calls[1][1]).not.toEqual(undefined)
    });

    it('adds scripts to new package.json', () => {
      const mockAdd = helpers.addScriptToNewPackageJSON = jest.fn()
      helpers.writeFile = jest.fn()
      addMongoDb.addMongoDBToProject = jest.fn()

      addMongooseToScripts()

      expect(mockAdd).toBeCalled()
      expect(mockAdd.mock.calls[0]).toEqual(["model", "node scripts/model.js"])
    });

    it('calls addMongoDBToProject', () => {
      helpers.writeFile = jest.fn()
      helpers.addScriptToNewPackageJSON = jest.fn()
      const mockAddMongo = addMongoDb.addMongoDBToProject = jest.fn()

      addMongooseToScripts()

      expect(mockAddMongo).toBeCalled()
    })
  })
    

  describe("addMongoDBToProject", () => {
    it("Adds mongoose to server.js", () => {
      const connectionString = `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
      const mockInsert = helpers.insert = jest.fn()
      helpers.appendFile = jest.fn()
      helpers.addDependenciesToStore = jest.fn()
      store.name = 'TestApp'

      addMongoDBToProject()

      expect(mockInsert).toBeCalled()
      expect(mockInsert.mock.calls[0][0]).toEqual('./TestApp/server/server.js')
      expect(mockInsert.mock.calls[0][1]).toEqual(connectionString)
      expect(mockInsert.mock.calls[0][2]).toEqual(0)
    })

    it("Adds the Mongo connection string to .env", () => {
      const mockAppend = helpers.appendFile = jest.fn()
      helpers.insert = jest.fn()
      helpers.addDependenciesToStore = jest.fn()
      store.name = 'TestApp'

      addMongoDBToProject()

      expect(mockAppend).toBeCalled()
      expect(mockAppend.mock.calls[0][0]).toEqual('.env')
      expect(mockAppend.mock.calls[0][1]).toEqual('MONGO=mongodb://localhost:27017/TestApp')
    })

    it("Adds mongo and mongoose to the store devDependencies", () => {
      const mockAdd = helpers.addDependenciesToStore = jest.fn()
      helpers.appendFile = jest.fn()
      helpers.insert = jest.fn()

      addMongoDBToProject()

      expect(mockAdd).toBeCalled()
      expect(mockAdd.mock.calls[0][0]).toEqual('mongo mongoose')
    })
  })
});