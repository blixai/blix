let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const routes = require('./routes')
let port = (process.env.PORT || 3000)
let helmet = require('helmet')
let compression = require('compression')

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use('/api/v1', routes)

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port: ${port}`)
})