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
app.set('views', './server/views')
app.set('view engine', 'pug')

const routes = require('./routes')


app.use('/', routes)
app.use(express.static('public'))
app.use('/assets', express.static('assets'))


app.listen(port, () => {
  process.stdout.write('\033c')
  console.log(`Listening at port ${port}`)
})
