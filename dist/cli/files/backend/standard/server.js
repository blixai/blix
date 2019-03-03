"use strict";
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var compression = require("compression");
var helmet = require("helmet");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
if (!process.env.NODE_ENV) {
    app.use(logger("dev"));
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
var routes = require("./routes");
app.use("/", routes);
app.use("/dist", express.static("dist"));
app.use("/assets", express.static("assets"));
app.use(function (req, res, next) {
    var err = new Error("File Not Found");
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ error: err.status, message: err.message });
});
app.listen(port, function () {
    console.log("Worker " + process.pid + " listening at port " + port);
});
module.exports = app;
