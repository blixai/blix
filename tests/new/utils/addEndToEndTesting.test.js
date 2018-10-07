// import store

// before all
  // create test folder inside store.name
  // package.json
    // jest

// after all
  // destroy

// e2eSetup
  // check store 
    // if store.e2e.e2e === "cafe"
      // use sinon.js - does it call installTestCafe
    // if store.e2e.e2e === "cypress"
      // use sinon.js - does it call installCypress

// installCypress
  // check files does store.name/cypress/integration/test.js exists?
  // does  jest.modulePathIgnorePatterns exist?
  // does  jest. moduleNameMapper exist?

// installTestCafe 
  // check if store.name/test/e2e/test.js exists?
  // does  jest.modulePathIgnorePatterns exist?
  // does  jest. moduleNameMapper exist?


