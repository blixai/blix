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
  