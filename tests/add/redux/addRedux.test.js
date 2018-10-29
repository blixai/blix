jest.mock('fs')
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))
jest.mock('../../../helpers')


const store = require('../../../new/store')

const {

} = require('../../../add/redux/addRedux')

const addReduxModule = require('../../../add/redux/addRedux')
