const helpers = require("../../helpers");
const fs = require("fs");
const path = require("path");
const store = require('../store')
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync(`./${name}/test/server`)) {
    fs.mkdirSync(`./${name}/test/server`);
  }
};

const mochaTestBackend = async () => {
  await helpers.installDevDependencies("mocha chai chai-http");
  helpers.addScriptToNewPackageJSON("mocha", "mocha test/server");
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    `./${name}/test/server/test.spec.js`,
    loadFile("../files/testing/backend/mocha.js")
  );
  let json = JSON.parse(fs.readFileSync(`./${name}/package.json`, "utf8"));
  if (json.hasOwnProperty("jest")) {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/",
      "<rootDir>/test/server/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
};

const testJestBackend = async () => {
  await helpers.installDevDependencies("jest supertest");
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    `./${name}/test/server/test.spec.js`,
    loadFile("../files/testing/backend/jest.js")
  );
  let json = JSON.parse(fs.readFileSync(`./${name}/package.json`, "utf8"));
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
  fs.writeFileSync(`./${name}/package.json`, newPackage);
  helpers.addScriptToNewPackageJSON("jest", "jest");
};

let testBackend = async () => {
  store.serverTesting.server === "mocha"
    ? await mochaTestBackend()
    : store.serverTesting.server === "jest"
      ? await testJestBackend()
      : "";
};

module.exports = {
  mochaTestBackend,
  testJestBackend,
  testBackend
};
