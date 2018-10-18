let store = require('../../new/store')
let helpers = require('../../helpers')
let addMongoDB = require('../../add/backend/addMongoDB')
let addBookshelf = require('../../add/backend/addBookshelf')
let inquirer = require('inquirer')

let addDatabase = require('../../add/database/addDataBase')

jest.mock('../../helpers')
jest.mock('../../add/backend/addMongoDB')
jest.mock('../../add/backend/addBookshelf')
jest.mock('inquirer')

describe('addDatabase', () => {
    describe('addDatabase', () => {
        addDatabase()

        expect(inquirer.prompt).toBeCalled()
        store.database = ''
    })
})
