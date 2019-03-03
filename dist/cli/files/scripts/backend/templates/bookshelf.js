"use strict";
var bookshelf = require('./bookshelf');
var ModelName = bookshelf.Model.extend({
    tableName: 'LowerCasePlural'
});
module.exports = ModelName;
