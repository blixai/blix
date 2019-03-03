"use strict";
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var routes = require("./routes");
var port = process.env.PORT || 3000;
var helmet = require("helmet");
var logger = require("morgan");
if (!process.env.NODE_ENV) {
    app.use(logger("dev"));
}
app.use(helmet());
app.use(bodyParser.json());
app.use("/", routes);
app.use(function (req, res, next) {
    var err = new Error("File Not Found");
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ error: err.message, status: err.status });
});
app.listen(port, function () {
    console.log("Worker " + process.pid + " listening at port: " + port);
});
module.exports = app;
