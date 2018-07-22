const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

if (!process.env.NODE_ENV) {
  app.use(logger("dev"));
}

const routes = require("./routes");
app.use("/", routes);
app.use(express.static("dist"));
app.use("/assets", express.static("assets"));

app.use((req, res, next) => {
  let err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", { error: err.status, message: err.message });
});

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port ${port}`);
});

module.exports = app;
