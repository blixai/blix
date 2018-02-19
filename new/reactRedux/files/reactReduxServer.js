let express = require('express')
let app = express() 
let path = require('path') 
let port = (process.env.PORT || 3000) 
let bodyParser = require('body-parser') 
let compression = require('compression') 
const routes = require('./routes') 
let helmet = require('helmet')
let logger = require('morgan')


app.use(helmet())
app.use(compression())
app.use(bodyParser.json()) 
if (!process.env.NODE_ENV) app.use(logger('dev'))


app.use('/assets', express.static('assets'))
app.use('/', routes) 
app.use('/build', express.static('build')) 


app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html'))) 

app.listen(port, () => { 
  console.log(`Worker ${process.pid} listening at port: ${port}`)
}) 