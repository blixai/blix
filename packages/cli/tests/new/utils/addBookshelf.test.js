const store = require('../../../new/store')
let helpers = require('../../../helpers')

jest.mock('../../../helpers')

let {addBookshelfToScripts} = require('../../../new/utils/addBookshelf')

describe('New Utils module: addBookshelf', () => {
  it('sets up bookshelf and knex.js', () => {
    addBookshelfToScripts()

    expect(helpers.writeFile).toBeCalledTimes(4)
    expect(helpers.writeFile.mock.calls[0][0]).toEqual('server/models/bookshelf.js')
    expect(helpers.writeFile.mock.calls[1][0]).toEqual('scripts/model.js')
    expect(helpers.writeFile.mock.calls[2][0]).toEqual('scripts/templates/migration.js')
    expect(helpers.writeFile.mock.calls[3][0]).toEqual('scripts/templates/bookshelf.js')
    expect(helpers.addScriptToPackageJSON).toBeCalledWith('model', 'node scripts/model.js')
    expect(helpers.installKnexGlobal).toBeCalled()
    expect(helpers.modifyKnex).toBeCalled()
    expect(helpers.addDependenciesToStore).toBeCalledWith('pg bookshelf knex')
  })
})