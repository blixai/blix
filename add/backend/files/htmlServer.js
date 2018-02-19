let express = require('express')
let app = express()
let port = (process.env.PORT || 3000)
let path = require('path')
let bodyParser = require('body-parser')
let compression = require('compression')
let helmet = require('helmet')
let logger = require('morgan')
let cookieParser = require('cookie-parser')


app.use(cookieParser())
app.use(bodyParser.json())
app.use(compression())
app.use(helmet())
if (!process.env.NODE_ENV) app.use(logger('dev'))


const routes = require('./routes')


app.use('/', routes)
app.use(express.static('dist'))
app.use('/assets', express.static('assets'))


app.use((req, res, next) => {
  let err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message, status: err.status })
});

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port ${port}`)
})