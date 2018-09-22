const fs = require("fs");
const helpers = require("../../helpers");
const path = require("path");
const name = process.argv[3];
const store = require('../store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

let e2eSetup = async () => {
  if (store.e2e.e2e === "cafe") {
    await installTestCafe();
  } else if (store.e2e.e2e === "cypress") {
    await installCypress();
  }
};

const installCypress = async () => {
  helpers.addScriptToNewPackageJSON("e2e", "cypress open");
  await helpers.installDevDependencies("cypress");
  fs.mkdirSync(`./${name}/cypress`);
  fs.mkdirSync(`./${name}/cypress/integration`);
  helpers.writeFile(
    `./${name}/cypress/integration/test.js`,
    loadFile("../files/frontend/e2e/cypress.js")
  );
  // let ignore = {
  //   "modulePathIgnorePatterns": ["<rootDir>/test/e2e/", "<rootDir>/cypress"]
  // }
  let jest = {
    modulePathIgnorePatterns: ["<rootDir>/test/e2e/", "<rootDir>/cypress"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync(`./${name}/package.json`, "utf8"));
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
};

const installTestCafe = async () => {
  helpers.addScriptToNewPackageJSON("e2e", "testcafe chrome test/e2e");
  await helpers.installDevDependencies("testcafe");
  fs.mkdirSync(`./${name}/test/e2e`);
  helpers.writeFile(
    `./${name}/test/e2e/test.js`,
    loadFile("../files/frontend/e2e/testcafe.js")
  );
  let jest = {
    modulePathIgnorePatterns: ["<rootDir>/test/e2e/", "<rootDir>/cypress"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync(`./${name}/package.json`, "utf8"));
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
};

module.exports = {
  e2eSetup,
  installCypress,
  installTestCafe
};
