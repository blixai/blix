const express = require('express')
const r = express.Router()
module.exports = r

const home = require('./controllers/home')
r.get('/', home.index)