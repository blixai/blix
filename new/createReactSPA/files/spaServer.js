let express = require('express')
let app = express()
let path = require('path') 
let bodyParser = require('body-parser') 
const routes = require('./routes') 
let port = (process.env.PORT || 3000) 
let compression = require('compression') 
let helmet = require('helmet')
let logger = require('morgan')


app.use(helmet())
app.use(compression()) 
app.use(bodyParser.json()) 
if (!process.env.NODE_ENV) app.use(logger('dev'))

app.use('/', routes) 
app.use('/assets', express.static('assets'))

app.use('/build', express.static('build')) 

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html'))) 

app.listen(port, () => { 
  console.log(`Worker ${process.pid} is listening at port: ${port}`) 
})