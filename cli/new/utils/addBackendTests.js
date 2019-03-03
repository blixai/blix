const helpers = require("../../../dist/src");
const fs = require("fs");
const path = require("path");
const store = require('../../../store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

let filePath = ''

const checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync(`./${filePath}test/server`)) {
    helpers.mkdirSync(`test/server`);
  }
};

const mochaTestBackend = () => {
  helpers.addDependenciesToStore("mocha chai chai-http", 'dev');
  helpers.addScriptToPackageJSON("mocha", "mocha test/server");
  checkOrCreateServerTestFolder();
  helpers.writeFile(`test/server/test.spec.js`, loadFile("../files/testing/backend/mocha.js"))

  let json = JSON.parse(fs.readFileSync(`./${filePath}package.json`, "utf8"));
  if (json.hasOwnProperty("jest")) {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/",
      "<rootDir>/test/server/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`package.json`, newPackage);
};

const testJestBackend = () => {
  helpers.addDependenciesToStore("jest supertest", 'dev');
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    `test/server/test.spec.js`,
    loadFile("../files/testing/backend/jest.js")
  );
  let json = JSON.parse(fs.readFileSync(`./${filePath}package.json`, "utf8"));
  if (!json.hasOwnProperty("jest")) {
    let jest = {
      modulePathIgnorePatterns: ["<rootDir>/test/e2e/", "<rootDir>/cypress"],
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
          "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "identity-obj-proxy"
      }
    };
    json["jest"] = jest;
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`package.json`, newPackage);
  helpers.addScriptToPackageJSON("jest", "jest");
};

let testBackend = () => {
  if (store.name){
    filePath = store.name + '/'
  } 
  store.serverTesting.server === "mocha"
    ? mochaTestBackend()
    : store.serverTesting.server === "jest"
      ? testJestBackend()
      : "";
};

module.exports = {
  mochaTestBackend,
  testJestBackend,
  testBackend
};
