const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
const port = process.env.PORT || 3000;
const helmet = require("helmet");
const logger = require("morgan");

app.use(helmet());
app.use(bodyParser.json());
app.use("/", routes);
app.use("/assets", express.static("assets"));

if (!process.env.NODE_ENV) app.use(logger("dev"));

app.use((req, res, next) => {
  let err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message, status: err.status });
});

app.listen(port, () => {
  console.log(`Worker ${process.pid} listening at port: ${port}`);
});

module.exports = app;
