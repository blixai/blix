let knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development'])
let bookshelf = require('bookshelf')(knex);
module.exports = bookshelf