// const store = require('../../../new/store')
// Import all methods from addBackendTests
// import addScriptToNewPackageJSON


// Before All
  // Navigate into test environment
  // Set up folder structure for checkorCreateServerTestFolder

// After All 
  // Navigate out
  // destroy folders

// checkOrCreateServerTestFolder
  // add a name (represents the project name) to the store 
  // check if the folder exists
    // if it does, it should not do anything
    // else it should make a folder named test/server

// mochaTestBackend
  // before Create package.json
  // check store
    // Does store.devDependencies include mocha chai chai-http
  // check Package.json 
    // does package json script contain mocha & mocha test/server
    // does it include jest 
      // does json.jest include modulePathIgnorePatterns?
      // does modulePathIgnorePatterns === 
        // "<rootDir>/test/e2e/",
        // "<rootDir>/cypress/",
        // "<rootDir>/test/server/"
  // move into test/server
    // Check if test.spec.js exists
    // check if file matches "../../new/files/testing/backend/mocha.js"

// testJestBackend
  // before, create a package.json
  // check store
    // does it include jest & supetest
  // check if test/server/test.spec.js exists
    // check if it matches "../../../files/testing/backend/jest.js"
  // check package.json 
    // does json.jest include 
      // moduleNameMapper
      // modulePathIgnorePattern

// testBackend
  // check the store
    // if store.serverTesting.sever === "mocha"
      // sinon.js - check if mochaTestBackend
    // if store.serverTesting.server === "jest" 
      // sinon.js - check if testJestBackend