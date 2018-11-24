jest.mock('../../../helpers')

const helpers = require('../../../helpers')

const addAPIScript = require('../../../new/utils/addAPIScript')

describe('Add API Script', () => {
    it('uses helpers.writeFile to create an api script and api template', () => {
        addAPIScript()

        expect(helpers.writeFile).toBeCalledTimes(2)
        expect(helpers.writeFile).toBeCalledWith('scripts/api.js', expect.any(String))
        expect(helpers.writeFile).toBeCalledWith('scripts/templates/api.js', expect.any(String))
    })

    it('adds api script to package.json', () => {
        addAPIScript()

        expect(helpers.addScriptToPackageJSON).toBeCalledWith('api', 'node scripts/api.js')
    })

    it('adds packages to store', () => {
        addAPIScript()

        expect(helpers.addDependenciesToStore).toBeCalledWith('axios')
    })
})