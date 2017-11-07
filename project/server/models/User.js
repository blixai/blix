let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.ObjectId

let userSchema = new Schema({
      email: String,
      posts: Number,
      password: String

})

module.exports = mongoose.model('User', userSchema)