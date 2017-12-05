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


app.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port ${port}`)
})
