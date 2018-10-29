jest.mock('fs')
const store = require('../../../new/store');
const helpers = require('../../../helpers')
const {
  addMongooseToScripts,
  addMongoDBToProject,
  envFile
} = require('../../../new/utils/addMongoDB');
const addMongoDb = require('../../../new/utils/addMongoDB')
const fs = require('fs')

describe('Add Mongo DB', () => {
  describe("addMongooseToScripts", () => {

    it('creates model.js and schemaTemplate.js', () => {
      const mockWrite = helpers.writeFile = jest.fn()
      addMongoDb.addMongoDBToProject = jest.fn()
      helpers.addScriptToPackageJSON = jest.fn()


      addMongooseToScripts()

      expect(mockWrite).toBeCalled()
      expect(mockWrite).toBeCalledTimes(2)
      expect(mockWrite.mock.calls[0][0]).toEqual('scripts/model.js')
      expect(mockWrite.mock.calls[1][0]).toEqual('scripts/templates/schemaTemplate.js')
    });

    it('adds scripts to new package.json', () => {
      const mockAdd = helpers.addScriptToPackageJSON = jest.fn()
      helpers.writeFile = jest.fn()
      addMongoDb.addMongoDBToProject = jest.fn()

      addMongooseToScripts()

      expect(mockAdd).toBeCalled()
      expect(mockAdd.mock.calls[0]).toEqual(["model", "node scripts/model.js"])
    });

    it('calls addMongoDBToProject', () => {
      helpers.writeFile = jest.fn()
      helpers.addScriptToPackageJSON = jest.fn()
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

    it('calls envFile', () => {
      const mockEnvFile = addMongoDb.envFile = jest.fn()

      addMongoDBToProject()

      expect(mockEnvFile).toBeCalled()
    })

    it("adds mongo and mongoose to the store devDependencies", () => {
      const mockAdd = helpers.addDependenciesToStore = jest.fn()
      helpers.appendFile = jest.fn()
      helpers.insert = jest.fn()

      addMongoDBToProject()

      expect(mockAdd).toBeCalled()
      expect(mockAdd.mock.calls[0][0]).toEqual('mongo mongoose')
    })
  })

  describe('envFile', () => {
    it('sets connection to store.name if store.name exists', () => {
      store.name = 'test'

      envFile()

      expect(helpers.writeFile).toBeCalledWith('.env', 'MONGO=mongodb://localhost:27017/test')
    })

    it('sets connection to current working directory name if no store.name exists', () => {
      store.name = ''
      helpers.getCWDName = jest.fn().mockReturnValue('boom')

      envFile()

      expect(helpers.writeFile).toBeCalledWith('.env', 'MONGO=mongodb://localhost:27017/boom')
    })
    
    it("writes the mongo connection string to a new .env if .env does not exist", () => {
      const mockwrite = helpers.writeFile = jest.fn()
      store.name = 'TestApp'

      envFile()

      expect(mockwrite).toBeCalled()
      expect(mockwrite.mock.calls[0][0]).toEqual('.env')
      expect(mockwrite.mock.calls[0][1]).toEqual('MONGO=mongodb://localhost:27017/TestApp')
    })

    it("appends the mongo connection string to a .env if it already exists", () => {
      fs.existsSync = jest.fn().mockReturnValueOnce(true)
      const mockwrite = helpers.writeFile = jest.fn()
      store.name = 'TestApp'

      envFile()

      expect(mockwrite).not.toBeCalled()
      expect(helpers.appendFile).toBeCalledWith('.env', '\nMONGO=mongodb://localhost:27017/TestApp')
    })
  })
});