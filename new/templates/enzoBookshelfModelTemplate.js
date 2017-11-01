let bookshelf = require('./bookshelf')

let ModelName = bookshelf.Model.extend({
  tableName: 'LowerCasePlural'
})

module.exports = ModelName