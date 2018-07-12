const fs = require("fs");
const path = require("path");
const helpers = require("../helpers");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

/// create things like .gitignore, scripts folder, scripts templates folder, README.md, .env, and package.json
const createCommonFilesAndFolders = projectName => {
  helpers.writeFile(
    `./${projectName}/.gitignore`,
    loadFile("./files/common/.gitignore")
  );
  helpers.writeFile(`./`, loadFile("./files/common/README.md"));
  helpers.writeFile(
    `./${projectName}/package.json`,
    loadFile("./files/package.json")
  );
  helpers.writeFile(`./${projectName}/.env`, "");
  fs.mkdirSync(`./${projectName}/scripts`);
  fs.mkdirSync(`./${projectName}/scripts/templates`);
};

module.exports = { createCommonFilesAndFolders };
