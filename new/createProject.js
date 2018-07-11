let fs = require("fs");
let path = require("path");
let shell = require("shelljs");
let execSync = require("child_process").execSync;
let chalk = require("chalk");
let log = console.log;
let boxen = require("boxen");
let inquirer = require("inquirer");
let prompt = inquirer.prompt;

// each project type and helpers
let spaBuild = require("./createReactSPA/createReactSPA");
let reactRedux = require("./reactRedux/reactRedux");
let noReactApp = require("./createAppWithoutReact/createAppWithoutReact");
let BE = require("./backendOnly/backendOnly");
let helpers = require("../helpers");

// variables
let name = process.argv[3];
let frontend;

// helper function to load files
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

// console prompts
const {
  project,
  backend,
  database,
  pug,
  testingWithoutReact,
  serverTesting,
  e2e,
  reactTesting
} = require("./prompts");

let promptProject = () => {
  prompt([project]).then(answers => {
    let project = answers.project;
    switch (project) {
      case "React SPA":
        spa();
        break;
      case "redux":
        redux();
        break;
      case "MVC":
        mvc();
        break;
      default:
        beOnly();
        break;
    }
  });
};

let spa = async () => {
  let be = await prompt([backend]);
  let test = await prompt([reactTesting]);
  let ui = await prompt([e2e]);
  if (be.backend) {
    let runner = await prompt([serverTesting]);
    let db = await prompt([database]);
    db.database === "Postgres"
      ? postgresSPA(test.enzyme, ui.e2e, runner.server)
      : db.database === "MongoDB"
        ? mongooseSPA(test.enzyme, ui.e2e, runner.server)
        : noDBSPA(test.enzyme, ui.e2e, runner.server);
  } else {
    spaNoBE(test.enzyme, ui.e2e);
  }
};

let redux = async () => {
  let be = await prompt([backend]);
  let test = await prompt([reactTesting]);
  let ui = await prompt([e2e]);
  if (be.backend) {
    let runner = await prompt([serverTesting]);
    let db = await prompt([database]);
    db.database === "Postgres"
      ? postgresRedux(runner.server, test.enzyme, ui.e2e)
      : db.database === "MongoDB"
        ? mongooseRedux(runner.server, test.enzyme, ui.e2e)
        : noDBRedux(runner.server, test.enzyme, ui.e2e);
  } else {
    reduxNoBE(test.enzyme, ui.e2e);
  }
};

let mvc = async () => {
  let db = await prompt([database]);
  let p = await prompt([pug]);
  let test = await prompt([testingWithoutReact]);
  let ui = await prompt([e2e]);
  if (db.database === "Postgres") {
    p.pug
      ? postgresMvcPug(test.test, ui.e2e)
      : posgresMvcNoPug(test.test, ui.e2e);
  } else if (db.database === "MongoDB") {
    p.pug
      ? mongooseMvcPug(test.test, ui.e2e)
      : mongooseMvcNoPug(test.test, ui.e2e);
  } else {
    p.pug ? noDbMvcPug(test.test, ui.e2e) : noDbMvcNoPug(test.test, ui.e2e);
  }
};

let beOnly = async () => {
  let test = await prompt([testingWithoutReact]);
  let db = await prompt([database]);
  if (db.database === "Postgres") {
    postgresBE(test.test);
  } else if (db.database === "MongoDB") {
    mongooseBE(test.test);
  } else {
    noDbBE(test.test);
  }
};

let createProject = () => {
  if (name) {
    // not sure we need this line here // maybe after they've made their selections
    fs.mkdirSync(`./${name}`);
    process.stdout.write("\033c");
    promptProject();
  } else {
    // need to include a message
    log('No name provided. Please run "enzo new <projectName>"');
    process.exit();
  }
};

let postgresSPA = (reactTesting, e2e, serverTesting) => {
  spaBuild.writeFilesWithSPAReact();
  addBookshelfToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon pg knex body-parser compression helmet react react-dom dotenv bookshelf morgan"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  helpers.installKnexGlobal();
  helpers.modifyKnex(name);
  installReactTesting(reactTesting);
  e2eSetup(e2e);
  testBackend(serverTesting);
  try {
    execSync(`createdb ${name}`, { stdio: "ignore" });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write("\033c");
  log("");
  log("The project was created!");
  log(`cd into ${name}`);
  log("First: npm run build");
  log("Then: npm start");
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example: ` +
        chalk.bold.cyanBright(`npm run api <name>`) +
        ` || use:` +
        chalk.yellowBright(` quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nreact || example:` +
        chalk.bold.cyanBright(` npm run react <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `quickly create a stateful or stateless React component`
        ) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(`npm run model User email:string`) +
        ` || use: ` +
        chalk.yellowBright(`create a Bookshelf model + database migration`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let mongooseSPA = (reactTesting, e2e, serverTesting) => {
  spaBuild.writeFilesWithSPAReact();
  addMongooseToEnzo();
  fs.writeFileSync(`./${name}/.env`);
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon compression helmet mongo dotenv body-parser react react-dom dotenv mongoose morgan"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  installReactTesting(reactTesting);
  e2eSetup(e2e);
  testBackend(serverTesting);
  process.stdout.write("\033c");
  log("");
  log("The project was created!");
  log(`cd into ${name}`);
  log("First: npm run build");
  log("Then: npm start");
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example: ` +
        chalk.bold.cyanBright(`npm run api <name>`) +
        ` || use: ` +
        chalk.yellowBright(`quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nreact || example: ` +
        chalk.bold.cyanBright(`npm run react <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `quickly create a stateful or stateless React component`
        ) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(
          `npm run model User email:String password:String posts:Number`
        ) +
        ` || use: ` +
        chalk.yellowBright(`create a Mongoose model`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let noDBSPA = (reactTesting, e2e, serverTesting) => {
  spaBuild.writeFilesWithSPAReact();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon compression helmet body-parser react react-dom dotenv morgan"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  installReactTesting(reactTesting);
  e2eSetup(e2e);
  testBackend(serverTesting);
  process.stdout.write("\033c");
  log("");
  log("The project was created!");
  log(`cd into ${name}`);
  log("First: npm run build");
  log("Then: npm start");
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example: ` +
        chalk.bold.cyanBright(`npm run api <name>`) +
        ` || use:` +
        chalk.yellowBright(` quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nreact || example: ` +
        chalk.bold.cyanBright(`npm run react <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `quickly create a stateful or stateless React component`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let spaNoBE = (reactTesting, e2e) => {
  spaBuild.reactSPAWithoutBackend();
  log("Installing dependencies and running setup, this may take a moment");
  shell.cd(`${name}`);
  helpers.install("react react-dom");
  helpers.installDevDependencies(
    "webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  installReactTesting(reactTesting);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(
    `cd into ${name} and run npm start, then refresh the page after a second`
  );
  log("Unique package.json Commands");
  log(
    boxen(
      `react || example: ` +
        chalk.bold.cyanBright(`npm run react <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `quickly create a stateful or stateless React component`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let postgresRedux = (runner, test, e2e) => {
  reactRedux.ReactReduxWithBackend();
  addBookshelfToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "redux react-router-dom react-redux express dotenv nodemon pg knex body-parser compression helmet react react-dom bookshelf morgan"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  installReactTestingForRedux(test);
  e2eSetup(e2e);
  testBackend(runner);
  helpers.installKnexGlobal();
  helpers.modifyKnex(name);
  try {
    execSync(`createdb ${name};`, { stdio: "ignore" });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name}`);
  log(`First start webpack: npm run build`);
  log(`To start server: npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example: ` +
        chalk.bold.cyanBright(`npm run api <name>`) +
        ` || use: ` +
        chalk.yellowBright(`quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nredux || example: ` +
        chalk.bold.cyanBright(`npm run redux <componentName>`) +
        ` || use:` +
        chalk.bold.yellowBright(
          `redux container + react component + react-router route`
        ) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(`npm run model User email:string`) +
        ` || use: ` +
        chalk.yellowBright(
          `create a Bookshelf model + knex database migration`
        ) +
        `\n\naction || example:` +
        chalk.bold.cyanBright(` npm run action`) +
        ` || use: ` +
        chalk.yellowBright(
          `create/apply action to existing/created reducer and selected containers`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let mongooseRedux = (runner, test, e2e) => {
  reactRedux.ReactReduxWithBackend();
  addMongooseToEnzo();
  shell.cd(`${name}`);
  process.stdout.write("\033c");
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "redux react-router-dom react-redux express nodemon dotenv compression helmet mongo dotenv body-parser react react-dom mongoose morgan"
  );
  helpers.installDevDependencies(
    " webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  installReactTestingForRedux(test);
  e2eSetup(e2e);
  testBackend(runner);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name}`);
  log(`First start webpack: ` + chalk.cyanBright(`npm run build`));
  log(`To start server: ` + chalk.cyanBright(`npm start`));
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name>`) +
        ` || use: quickly create` +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nredux || example: ` +
        chalk.bold.cyanBright(`npm run redux <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `redux container + react component + react-router route`
        ) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(
          `npm run model User email:String posts:Number password:String`
        ) +
        ` || use: ` +
        chalk.yellowBright(`create a Mongoose model`) +
        `\n\naction || example:` +
        chalk.bold.cyanBright(` npm run action`) +
        ` || use: ` +
        chalk.yellowBright(
          `create/apply action to existing/created reducer and selected containers`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let noDBRedux = (runner, test, e2e) => {
  reactRedux.ReactReduxWithBackend();
  shell.cd(`${name}`);
  process.stdout.write("\033c");
  log(
    chalk.cyanBright(
      "Downloading dependencies and setting up the project, this may take a moment"
    )
  );
  helpers.install(
    "redux react-router-dom react-redux express nodemon dotenv body-parser compression helmet react react-dom morgan"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );

  installReactTestingForRedux(test);
  e2eSetup(e2e);
  testBackend(runner);
  // process.stdout.write('\033c')
  log(chalk.cyanBright("The project was created!"));
  log(chalk.cyanBright(`cd into ${name}`));
  log(
    chalk.cyanBright(`First start webpack: `) +
      chalk.yellowBright(`npm run build`)
  );
  log(chalk.cyanBright(`To start server: npm start`));
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example: ` +
        chalk.bold.cyanBright(`npm run api <name>`) +
        ` || use: ` +
        chalk.yellowBright(`quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nredux || example: ` +
        chalk.bold.cyanBright(`npm run redux <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `redux container, react component, react-router route`
        ) +
        `\n\naction || example:` +
        chalk.bold.cyanBright(` npm run action`) +
        ` || use: ` +
        chalk.yellowBright(
          `create/apply action to existing/created reducer and selected containers`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let reduxNoBE = (test, e2e) => {
  reactRedux.reactReduxWithoutBackend();
  shell.cd(`${name}`);
  process.stdout.write("\033c");
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install("redux react-router-dom react-redux react react-dom");
  helpers.installDevDependencies(
    "webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );

  installReactTestingForRedux(test);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name}`);
  log(`First start webpack: npm run build`);
  log(`To open project: npm start`);
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `redux || example: ` +
        chalk.bold.cyanBright(`npm run redux <componentName>`) +
        ` || use: ` +
        chalk.yellowBright(
          `redux container, react component, react-router route`
        ) +
        `\n\naction || example:` +
        chalk.bold.cyanBright(` npm run action`) +
        ` || use: ` +
        chalk.yellowBright(
          `create/apply action to existing/created reducer and selected containers`
        ),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let postgresMvcPug = (test, e2e) => {
  noReactApp.pugApp(test);
  addBookshelfToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon pg knex body-parser compression helmet dotenv bookshelf pug morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  helpers.installKnexGlobal();
  helpers.modifyKnex(name);
  try {
    execSync(`createdb ${name};`, { stdio: "ignore" });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name>`) +
        ` || use:` +
        chalk.yellowBright(` quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete endpoints`) +
        chalk.yellowBright(` for a resource`) +
        `\n\nmodel || example: npm run model User email:string posts:integer || use: creates Bookshelf model + migration\n\npage || example: npm run page Landing signup login || creates page routes and pug pages`,
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let posgresMvcNoPug = (test, e2e) => {
  noReactApp.railsApp(test);
  addBookshelfToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon pg knex body-parser compression helmet dotenv bookshelf morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  helpers.installKnexGlobal();
  helpers.modifyKnex(name);
  try {
    execSync(`createdb ${name};`, { stdio: "ignore" });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name>`) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete `) +
        chalk.yellowBright(`endpoints for a resource`) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(`npm run model User email:string posts:integer`) +
        ` || use: ` +
        chalk.yellowBright(`creates Bookshelf model + migration`) +
        `\n\npage || example:` +
        chalk.bold.cyanBright(` npm run page Landing`) +
        ` || use: ` +
        chalk.yellowBright(`creates page route and page`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let mongooseMvcPug = (test, e2e) => {
  noReactApp.pugApp(test);
  addMongooseToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon mongo body-parser compression helmet dotenv mongoose pug morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete `) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(
          `npm run model User email: String posts: Number`
        ) +
        ` || use: ` +
        chalk.yellowBright(`creates Mongoose model`) +
        `\n\npage || example:` +
        chalk.bold.cyanBright(` npm run page Article new all`) +
        ` || use:` +
        chalk.yellowBright(` creates controller and views`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let mongooseMvcNoPug = (test, e2e) => {
  noReactApp.railsApp(test);
  addMongooseToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon mongo body-parser compression helmet dotenv mongoose morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(`npm run model User email:String posts:Number`) +
        ` || use: ` +
        chalk.yellowBright(`creates Mongoose model`) +
        `\n\npage || example:` +
        chalk.bold.cyanBright(` npm run page Landing`) +
        ` || use:` +
        chalk.yellowBright(` creates page and route`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let noDbMvcPug = (test, e2e) => {
  noReactApp.pugApp(test);
  process.stdout.write("\033c");
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon body-parser compression helmet dotenv pug morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\npage || example:` +
        chalk.bold.cyanBright(` npm run page Article new all`) +
        ` || use:` +
        chalk.yellowBright(` creates resource controller and views`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let noDbMvcNoPug = (test, e2e) => {
  noReactApp.railsApp(test);
  process.stdout.write("\033c");
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon body-parser compression helmet dotenv morgan cookie-parser"
  );
  helpers.installDevDependencies(
    "babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext"
  );
  beOnlyInstallTesting(test);
  e2eSetup(e2e);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\npage || example:` +
        chalk.cyanBright(`npm run page Landing`) +
        ` || use:` +
        chalk.yellowBright(` creates page in src folder + routes.js`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let postgresBE = test => {
  BE.backendOnly(test);
  addBookshelfToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon pg knex body-parser helmet dotenv bookshelf morgan"
  );
  beOnlyInstallTesting(test);
  helpers.installKnexGlobal();
  helpers.modifyKnex(name);
  try {
    execSync(`createdb ${name};`, { stdio: "ignore" });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }

  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nmodel || example:` +
        chalk.bold.cyanBright(
          ` npm run model User email:string posts:integer`
        ) +
        ` || use: ` +
        chalk.yellowBright(`create Bookshelf model + knex migration`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let mongooseBE = test => {
  BE.backendOnly(test);
  addMongooseToEnzo();
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install(
    "express nodemon mongo body-parser helmet dotenv mongoose morgan"
  );
  beOnlyInstallTesting(test);
  process.stdout.write("\033c");
  log("The project was created!");
  log(`cd into ${name} and run npm start`);
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyan(`example: npm run api <name> `) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`) +
        `\n\nmodel || example: ` +
        chalk.bold.cyanBright(`npm run model User email:String posts:Number`) +
        ` || use: create Mongoose model`,
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
};

let noDbBE = test => {
  BE.backendOnly(test);
  shell.cd(`${name}`);
  log(
    "Downloading dependencies and setting up the project, this may take a moment"
  );
  helpers.install("express nodemon body-parser helmet dotenv morgan");
  beOnlyInstallTesting(test);
  process.stdout.write("\033c");
  log("The project was created!");
  log(chalk.cyanBright(`cd into ${name} and run npm start`));
  log("");
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: "yellow" }));
  log("");
  log("Unique package.json Commands");
  log(
    boxen(
      `api || example:` +
        chalk.bold.cyanBright(` npm run api <name>`) +
        ` || ` +
        chalk.yellowBright(`use: quickly create`) +
        chalk.bold.redBright(` api/v1 get/post/put/delete`) +
        chalk.yellowBright(` endpoints for a resource`),
      { padding: 1, borderColor: "yellow" }
    )
  );
  log("");
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

let mochaTestBackend = () => {
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

let checkOrCreateServerTestFolder = () => {
  if (!fs.existsSync("./test")) fs.mkdirSync("./test");
  if (!fs.existsSync("./test/server")) fs.mkdirSync("./test/server");
};

let testJestBackend = () => {
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

let installReactTestingForRedux = reactTests => {
  if (!reactTests) return;
  helpers.installDevDependencies(
    "jest enzyme redux-mock-store enzyme-adapter-react-16 identity-obj-proxy"
  );
  if (!fs.existsSync("./test")) fs.mkdirSync("./test");
  helpers.writeFile(
    "./test/Home.spec.js",
    loadFile("./filesToCopy/enzymeRedux.js")
  );
  let jest = {
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync("package.json", "utf8"));
  json["jest"] = jest;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
  helpers.addScript("test", "jest");
};

let installReactTesting = reactTests => {
  if (!reactTests) return;
  helpers.installDevDependencies(
    "jest enzyme enzyme-adapter-react-16 identity-obj-proxy"
  );
  if (!fs.existsSync("./test")) fs.mkdirSync("./test");
  helpers.writeFile(
    "./test/App.spec.js",
    loadFile("./filesToCopy/enzymeReact.js")
  );
  let jest = {
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync("package.json", "utf8"));
  json["jest"] = jest;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
  helpers.addScript("test", "jest");
};

let e2eSetup = answer => {
  answer === "cafe"
    ? installTestCafe()
    : answer === "cypress"
      ? installCypress()
      : "";
};

let installCypress = () => {
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

let installTestCafe = () => {
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

let addBookshelfToEnzo = () => {
  let bookshelf = loadFile("./templates/bookshelf.js");
  let enzoCreateBookshelfModel = loadFile(
    "./templates/enzoCreateBookshelfModel.js"
  );
  let migrationTemplate = loadFile("./templates/migrationTemplate.js");
  let enzoBookshelfModelTemplate = loadFile(
    "./templates/enzoBookshelfModelTemplate.js"
  );

  helpers.writeFile(`./${name}/server/models/bookshelf.js`, bookshelf);
  helpers.writeFile(
    `./${name}/scripts/enzoCreateBookshelfModel.js`,
    enzoCreateBookshelfModel
  );
  helpers.writeFile(
    `./${name}/scripts/templates/migrationTemplate.js`,
    migrationTemplate
  );
  helpers.writeFile(
    `./${name}/scripts/templates/enzoBookshelfModelTemplate.js`,
    enzoBookshelfModelTemplate
  );

  helpers.addScriptToNewPackageJSON(
    "model",
    "node scripts/enzoCreateBookshelfModel.js",
    name
  );
  // need to add script for this to package.json
};

let addMongooseToEnzo = () => {
  let model = loadFile("./templates/enzoCreateMongooseModel.js");
  let schemaTemplate = loadFile("./templates/schemaTemplate.js");

  helpers.writeFile(`./${name}/scripts/model.js`, model);
  helpers.writeFile(
    `./${name}/scripts/templates/schemaTemplate.js`,
    schemaTemplate
  );

  helpers.addScriptToNewPackageJSON("model", "node scripts/model.js", name);
  addMongoDBToProject();
};

let addMongoDBToProject = () => {
  let server = fs
    .readFileSync(`./${name}/server/server.js`, "utf8")
    .toString()
    .split("\n");
  server.splice(
    0,
    0,
    `\nlet mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO)\n`
  );
  let mongoAddedServer = server.join("\n");

  helpers.writeFile(`./${name}/server/server.js`, mongoAddedServer);
  helpers.writeFile(
    `./${name}/.env`,
    `MONGO="${`mongodb://localhost/${name}`}"`
  );
};

module.exports = createProject;
