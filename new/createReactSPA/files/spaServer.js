let express = require('express')
let app = express()
let path = require('path') 
let bodyParser = require('body-parser') 
const routes = require('./routes') 
let port = (process.env.PORT || 3000) 
let compression = require('compression') 
app.use(compression()) 
app.use(bodyParser.json()) 

app.use('/api/v1', routes) 

app.use("/build", express.static(path.join(__dirname, "../build"))) 

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html'))) 

app.listen(port, () => { 
  process.stdout.write('\033c')
  console.log('Listening at port 3000') 
})