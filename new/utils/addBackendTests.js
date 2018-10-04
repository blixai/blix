const helpers = require("../../helpers");
const fs = require("fs");
const path = require("path");
const store = require('../store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync(`./${store.name}/test/server`)) {
    helpers.mkdirSync(`test/server`);
  }
};

const mochaTestBackend = () => {
  helpers.addDevDependenciesToStore("mocha chai chai-http");
  helpers.addScriptToNewPackageJSON("mocha", "mocha test/server");
  checkOrCreateServerTestFolder();
  helpers.writeFile(`test/server/test.spec.js`, loadFile("../files/testing/backend/mocha.js"))

  let json = JSON.parse(fs.readFileSync(`./${store.name}/package.json`, "utf8"));
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
  helpers.addDevDependenciesToStore("jest supertest");
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    `test/server/test.spec.js`,
    loadFile("../files/testing/backend/jest.js")
  );
  let json = JSON.parse(fs.readFileSync(`./${store.name}/package.json`, "utf8"));
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
  helpers.addScriptToNewPackageJSON("jest", "jest");
};

let testBackend = () => {
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
