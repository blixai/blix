const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync("./test")) fs.mkdirSync("./test");
  if (!fs.existsSync("./test/server")) fs.mkdirSync("./test/server");
};

const mochaTestBackend = () => {
  helpers.installDevDependencies("mocha chai chai-http");
  helpers.addScript("mocha", "mocha test/server");
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    "./test/server/test.spec.js",
    loadFile("./filesToCopy/mocha.js")
  );
  let json = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  if (json.hasOwnProperty("jest")) {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/",
      "<rootDir>/test/server/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
};

const testJestBackend = () => {
  helpers.installDevDependencies("jest supertest");
  checkOrCreateServerTestFolder();
  helpers.writeFile(
    "./test/server/test.spec.js",
    loadFile("./filesToCopy/jest.js")
  );
  let json = JSON.parse(fs.readFileSync("./package.json", "utf8"));
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
  fs.writeFileSync("package.json", newPackage);
  helpers.addScript("jest", "jest");
};

let beOnlyInstallTesting = test => {
  if (test === "mocha") helpers.installDevDependencies("mocha chai chai-http");
  if (test === "jest") helpers.installDevDependencies("jest supertest");
};

let testBackend = test => {
  test === "mocha"
    ? mochaTestBackend()
    : test === "jest"
      ? testJestBackend()
      : "";
};

module.exports = {
  mochaTestBackend,
  testJestBackend,
  beOnlyInstallTesting,
  testBackend
};
