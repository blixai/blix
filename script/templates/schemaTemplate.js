let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.ObjectId

let nameSchema = new Schema({

})

module.exports = mongoose.model('Name', nameSchema)