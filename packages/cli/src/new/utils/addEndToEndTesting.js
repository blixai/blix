const fs = require("fs");
const { 
  loadFile, 
  store,
  mkdirSync,
  writeFile,
  addScriptToPackageJSON,
  addDependenciesToStore,
  loadUserJSONFile,
  writeJSONFile,
  logTaskStatus
} = require("@blix/core");

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
  let json = loadUserJSONFile(`./${store.name}/package.json`);
  if (!json.hasOwnProperty("jest")) {
    json["jest"] = jest;
  } else {
    json.jest["modulePathIgnorePatterns"] = [
      "<rootDir>/test/e2e/",
      "<rootDir>/cypress/"
    ];
  }
  writeJSONFile(`package.json`, json);
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
  logTaskStatus('Configured Cypress.io', 'success')
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
  logTaskStatus('Configured TestCafe', 'success')
};

module.exports = {
  e2eSetup,
  installCypress,
  installTestCafe,
  addJestToPackageJson
};
