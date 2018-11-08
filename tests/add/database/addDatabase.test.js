jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))
jest.mock('../../../helpers')
jest.mock('../../../new/utils/addMongoDB')
jest.mock('../../../new/utils/addBookshelf')
jest.mock('../../../add/addProjectInstructions')

const inquirer = require('inquirer')
const { addProjectInstructions } = require('../../../add/addProjectInstructions')
const helpers = require('../../../helpers')
const { addMongooseToScripts } = require('../../../new/utils/addMongoDB')
const { addBookshelfToScripts } = require('../../../new/utils/addBookshelf')
const addDatabase = require('../../../add/database/addDataBase')
const { database } = require('../../../new/prompts')


describe('addDataBase', () => {
    it('prompts for a database', async() => {
        inquirer.prompt.mockResolvedValueOnce({ database: 'mongo' })

        await addDatabase()

        expect(inquirer.prompt).toBeCalledWith([database])
    })

    it('calls helpers.yarn', async () => {
        inquirer.prompt.mockResolvedValueOnce({ database: 'mongo' })

        await addDatabase()

        expect(helpers.yarn).toBeCalled()
    })

    it('calls addMongooseToScripts if selection is mongo', async () => {
        inquirer.prompt.mockResolvedValueOnce({ database: 'mongo' })

        await addDatabase()

        expect(addMongooseToScripts).toBeCalled()
    })

    it('calls addBookshelfToScripts if postgres is selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ database: 'pg' })

        await addDatabase()

        expect(addBookshelfToScripts).toBeCalled()
    })

    it('calls helpers.installAllPackagesToExistingProject and addProjectInstructions', async () => {
        inquirer.prompt.mockResolvedValueOnce({ database: 'mongo' })

        await addDatabase()

        expect(helpers.installAllPackagesToExistingProject).toBeCalled()
        expect(addProjectInstructions).toBeCalled()
    })
})