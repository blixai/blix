

const Name = require('./models/Name')
r.get('/Name', Name.get)
r.put('/Name/:id', Name.put)
r.delete('/Name/:id', Name.deleteName)
r.post('/Name', Name.post)