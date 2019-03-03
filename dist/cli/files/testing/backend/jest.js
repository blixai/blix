"use strict";
var request = require("supertest");
var app = require("../../server/server");
describe("Test root path", function () {
    test("It should get a status 200 response", function (done) {
        request(app)
            .get("/")
            .then(function (response) {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
