const path = require("path");

exports.index = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/home/index.html"));
};
