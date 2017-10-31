let bookshelf = require('./bookshelf')

exports.ModelName = bookshelf.Model.extend({
  tableName: 'LowerCasePlural'
})