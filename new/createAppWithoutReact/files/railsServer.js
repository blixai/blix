let express = require('express')
let app = express()
let port = (process.env.PORT || 3000)
let path = require('path')
let bodyParser = require('body-parser')
let compression = require('compression')
let helmet = require('helmet')


app.use(bodyParser.json())
app.use(compression())
app.use(helmet())


const routes = require('./routes')
const pages = require('./pages')


app.use('/api/v1', routes)
app.use('/', pages)
app.use(express.static('public'))


app.listen(port, () => {
  process.stdout.write('\033c')
  console.log('Listening at port 3000')
})