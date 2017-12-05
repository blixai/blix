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
app.use('/assets', express.static('assets'))

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404/index.html'))
});

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port ${port}`)
})