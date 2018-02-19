const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server/server');

chai.use(chaiHttp);

describe('Test', () => {
  it('should return an error', (done) => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
});