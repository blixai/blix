

const Name = require('./controllers/Name')
r.get('/api/v1/Name', Name.get)
r.put('/api/v1/Name/:id', Name.put)
r.delete('/api/v1/Name/:id', Name.deleteName)
r.post('/api/v1/Name', Name.post)