const fs = require("fs");
const helpers = require("../helpers");
const path = require("path");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const installCypress = () => {
  helpers.addScript("e2e", "cypress open");
  helpers.installDevDependencies("cypress");
  fs.mkdirSync(`./cypress`);
  fs.mkdirSync(`./cypress/integration`);
  helpers.writeFile(
    `./cypress/integration/test.js`,
    loadFile("./filesToCopy/cypress.js")
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
  let json = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
};

const installTestCafe = () => {
  helpers.addScript("e2e", "testcafe chrome test/e2e");
  helpers.installDevDependencies("testcafe");
  if (!fs.existsSync("./test")) fs.mkdirSync("./test");
  fs.mkdirSync("./test/e2e");
  helpers.writeFile(
    "./test/e2e/test.js",
    loadFile("./filesToCopy/testcafe.js")
  );
  let jest = {
    modulePathIgnorePatterns: ["<rootDir>/test/e2e/", "<rootDir>/cypress"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
};

module.exports = {
  installCypress,
  installTestCafe
};
