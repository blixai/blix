const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../server/server');

chai.use(chaiHttp);

describe('Test root path', () => {
  it('should return html', (done) => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });
});