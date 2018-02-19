let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const routes = require('./routes')
let port = (process.env.PORT || 3000)
let helmet = require('helmet')
let logger = require('morgan')

if (!process.env.NODE_ENV) app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.json())
app.use('/', routes)
app.use('/assets', express.static('assets'))


app.use(function (req, res, next) {
  var err = new Error('File Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send({ error: err.message, status: err.status })
})

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port: ${port}`)
})