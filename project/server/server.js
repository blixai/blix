let express = require('express')
let app = express() 
let path = require('path') 
let port = (process.env.PORT || 3000) 
let bodyParser = require('body-parser') 
let compression = require('compression') 
const routes = require('./routes') 
let helmet = require('helmet')


app.use(helmet())
app.use(compression())
app.use(bodyParser.json()) 


app.use('/api/v1', routes) 
app.use("/build", express.static(path.join(__dirname, "../build"))) 


app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html'))) 

app.listen(port, () => { 
  process.stdout.write('\033c')
  console.log(`Listening at port ${port}`)
}) 