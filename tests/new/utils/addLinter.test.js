// import store

// before all 
  // create package.json

// eslintPackageJsonScripts
  // if store.backend.backend && store.reactType
    // does package.json script include script.lint
    // does script.lint === eslint 'src/**/*.js' 'server/**/*.js'
  // if store.backend.backend
    // does package.json script include script.lint
    // does script.lint === eslint 'server/**/*.js'
  //  if store.reactType 
    // does package.json script include script.lint
    // does script.lint === eslint 'src/**/*.js'

// addLinter 
  // add linter = 'prittier'
    // does ./${name}/prettier.config.js exist
    // check package.json
      // does it include scripts.lint
      // does scripts.lint === prettier --config prettier.config.js --write '**/*.js
  // add linter = eslint
    // does ./${name}/.eslintrc.js exist 
    // use sinon.js - does it call eslintPackageJsonScripts
  // add linter = 'eslint_prettier'
    // does ./${name}/.eslintrc.js 
    // use sinon.js - does it call eslintPackageJsonScripts



