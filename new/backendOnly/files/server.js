let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const routes = require('./routes')
let port = (process.env.PORT || 3000)



app.use(bodyParser.json())
app.use('/api/v1', routes)

app.listen(port, () => {
  process.stdout.write('\033c')
  console.log('Listening at port 3000')
})