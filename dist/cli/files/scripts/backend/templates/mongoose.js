"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var nameSchema = new Schema({});
module.exports = mongoose.model('Name', nameSchema);
