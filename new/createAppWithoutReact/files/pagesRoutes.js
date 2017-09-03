const express = require('express')
const r = express.Router()
const path = require('path')
module.exports = r

r.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/home/index.html')))