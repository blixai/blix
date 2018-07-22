const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server/server");

chai.use(chaiHttp);

describe("Test root path", () => {
  it("should get a status 200 response", done => {
    chai
      .request(server)
      .get("/")
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
