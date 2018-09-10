const helpers = require("../../helpers");
const fs = require("fs");
const path = require("path");
const name = process.argv[3];
const store = require('../store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

let installReactTesting = () => {
  if (!store.reactTesting['enzyme']) {
    return;
  }
  helpers.installDevDependencies(
    "jest enzyme enzyme-adapter-react-16 identity-obj-proxy"
  );
  helpers.writeFile(
    `./${name}/test/App.spec.js`,
    loadFile("../files/frontend/enzyme/App.spec.js")
  );
  let jest = {
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    }
  };
  let json = JSON.parse(fs.readFileSync(`./${name}/package.json`, "utf8"));
  json["jest"] = jest;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
  helpers.addScriptToNewPackageJSON("test", "jest");
};

module.exports = { installReactTesting };
