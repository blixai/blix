const path = require('path')
const express = require('express')
const r = express.Router()
module.exports = r

r.get('/', (req, res) => res.sendFile(path.join(__dirname, '../dist/home/index.html')))
