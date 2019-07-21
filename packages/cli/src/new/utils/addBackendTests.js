const fs = require("fs");
const {
    loadFile,
    store,
    mkdirSync,
    writeFile,
    addDependenciesToStore,
    addScriptToPackageJSON,
    loadUserJSONFile,
    writeJSONFile,
    logTaskStatus
} = require("@blixi/core");


function checkOrCreateServerTestFolder() {
    if (!fs.existsSync(`${store.name}/test`)) {
        mkdirSync(`test`)
    }
    if (!fs.existsSync(`.${store.name}/test/server`)) {
        mkdirSync(`test/server`);
    }
};

const mochaTestBackend = () => {
    addDependenciesToStore("mocha chai chai-http", 'dev');
    addScriptToPackageJSON("mocha", "mocha test/server");
    checkOrCreateServerTestFolder();
    writeFile(`test/server/test.spec.js`, loadFile("testing/backend/mocha.js"))

    let json = loadUserJSONFile(`${store.name}/package.json`);
    if (json.hasOwnProperty("jest")) {
        json.jest["modulePathIgnorePatterns"] = [
            "<rootDir>/test/e2e/",
            "<rootDir>/cypress/",
            "<rootDir>/test/server/"
        ];
    }
    writeJSONFile(`package.json`, json);
};

const testJestBackend = () => {
    addDependenciesToStore("jest supertest", 'dev');
    checkOrCreateServerTestFolder();
    writeFile(
        `test/server/test.spec.js`,
        loadFile("testing/backend/jest.js")
    );
    let json = loadUserJSONFile(`${store.name}/package.json`);
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

    writeJSONFile(`package.json`, json);
    addScriptToPackageJSON("jest", "jest");
};

let testBackend = () => {
    store.serverTesting.server === "mocha"
        ? mochaTestBackend()
        : store.serverTesting.server === "jest"
            ? testJestBackend()
            : "";

    if (store.serverTesting.server) {
        logTaskStatus('Configure server testing', 'success')
    }
};

module.exports = {
    mochaTestBackend,
    testJestBackend,
    testBackend
};
