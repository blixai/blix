"use strict";
var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../../server/server");
chai.use(chaiHttp);
describe("Test root path", function () {
    it("should get a status 200 response", function (done) {
        chai
            .request(server)
            .get("/")
            .end(function (err, response) {
            response.should.have.status(200);
            done();
        });
    });
});
