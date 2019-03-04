const fs = require("fs");
const { 
  loadFile,
  store,
  mkdirSync,
  writeFile,
  addDependenciesToStore,
  addScriptToPackageJSON
} = require("../../../blix");


let filePath = ''

const checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync(`./${filePath}test/server`)) {
    mkdirSync(`test/server`);
  }
};

const mochaTestBackend = () => {
  addDependenciesToStore("mocha chai chai-http", 'dev');
  addScriptToPackageJSON("mocha", "mocha test/server");
  checkOrCreateServerTestFolder();
  writeFile(`test/server/test.spec.js`, loadFile("testing/backend/mocha.js"))

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
  addDependenciesToStore("jest supertest", 'dev');
  checkOrCreateServerTestFolder();
  writeFile(
    `test/server/test.spec.js`,
    loadFile("testing/backend/jest.js")
  );
  let json = JSON.parse(fs.readFileSync(`./${filePath}package.json`, "utf8"));
  // TODO create function to add keys to package.json directly
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
  addScriptToPackageJSON("jest", "jest");
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
