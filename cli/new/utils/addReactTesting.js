const fs = require("fs");
const { 
  loadFile, 
  store,
  addDependenciesToStore,
  writeFile,
  addScriptToPackageJSON
} = require("../../../blix");


let installReactTesting = () => {
  let name = store.name
  let file
  if (!store.reactTesting['enzyme']) {
    return;
  }
  if (store.reactType === 'react-router' || store.reactType === 'reactRouter-redux') {
    file = "Router.spec.js"
  } else {
    file = "App.spec.js"
  }
  addDependenciesToStore("jest enzyme enzyme-adapter-react-16 identity-obj-proxy babel-jest 'babel-core@^7.0.0-0'", 'dev')
  writeFile(
    `test/${file}`,
    loadFile(`frontend/enzyme/${file}`)
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
  addScriptToPackageJSON("test", "jest");
};

module.exports = {installReactTesting};
