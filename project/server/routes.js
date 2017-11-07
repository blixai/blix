const express = require('express')
const r = express.Router() 
module.exports = r

const client = require('./controllers/client')
r.get('/client', client.get)
r.put('/client/:id', client.put)
r.delete('/client/:id', client.deleteclient)
r.post('/client', client.post)