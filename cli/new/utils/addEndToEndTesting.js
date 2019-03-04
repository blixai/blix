const fs = require("fs");
const { 
  loadFile, 
  store,
  mkdirSync,
  writeFile,
  addScriptToPackageJSON,
  addDependenciesToStore
} = require("../../../blix");

let e2eSetup = () => {
  if (store.e2e.e2e === "cafe") {
    installTestCafe();
  } else if (store.e2e.e2e === "cypress") {
    installCypress();
  }
};

const addJestToPackageJson = () => {
  let jest = {
    // TODO either create jest config file or improve package.json handling
    modulePathIgnorePatterns: ["<rootDir>/test/e2e/", "<rootDir>/cypress"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync(`./${store.name}/package.json`, "utf8"));
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`package.json`, newPackage);
}

const installCypress = () => {
  addScriptToPackageJSON("e2e", "cypress open");
  addDependenciesToStore("cypress", 'dev');
  mkdirSync(`cypress`);
  mkdirSync(`cypress/integration`);
  writeFile(
    `cypress/integration/test.js`,
    loadFile("frontend/e2e/cypress.js")
  );
  addJestToPackageJson()
};

const installTestCafe = () => {
  addScriptToPackageJSON("e2e", "testcafe chrome test/e2e");
  addDependenciesToStore("testcafe", 'dev');
  mkdirSync(`test/e2e`);
  writeFile(
    `test/e2e/test.js`,
    loadFile("files/frontend/e2e/testcafe.js")
  );
  addJestToPackageJson()
};

module.exports = {
  e2eSetup,
  installCypress,
  installTestCafe,
  addJestToPackageJson
};
