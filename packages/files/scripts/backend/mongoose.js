let fs = require("fs");
let path = require("path");
let name = process.argv[2];
let schemaFields = process.argv.slice(3);

if (!name) {
  console.log("You need give your model a name!");
  console.log("Try: npm run model <name> [fieldName]:[Type]");
  return
}

schemaFields = schemaFields.map(field => {
  if (field.includes(":")) {
    let index = field.indexOf(":");
    let upperCaseLetter = field[index + 1].toUpperCase();
    field = field.split("");
    field.splice(index + 1, 1, upperCaseLetter);
    field = field.join("");
    return field;
  } else {
    return field
  }
});

let schemaTemplate = fs.readFileSync(
  path.resolve(__dirname, "./templates/schemaTemplate.js"),
  "utf8"
);
name = name.charAt(0).toUpperCase() + name.slice(1);
schemaTemplate = schemaTemplate.replace(/Name/, name);
let lowerCaseName = name.toLowerCase();
schemaTemplate = schemaTemplate.replace(/name/g, lowerCaseName);

let validSchemas = [
  "String",
  "Number",
  "Date",
  "Buffer",
  "Boolean",
  "Mixed",
  "ObjectId",
  "Array"
];

let fields = [];
schemaFields.map(field => {
  if (field.includes(':')) {
    let check = field.split(":");
    if (validSchemas.includes(check[1])) {
      let newLine = `${check[0]}: ${check[1]}`;
      fields.push(newLine);
    }
  } else {
    let newLine = `${field}: String`
    fields.push(newLine)
  }
});

let body = schemaTemplate.toString().split("\n");

for (let i = fields.length - 1; i >= 0; --i) {
  let string = `\u0020\u0020\u0020\u0020\u0020\u0020${fields[i]}`;
  if (i < fields.length - 1) {
    string = string + ",";
  }
  body.splice(5, 0, string);
}

schemaTemplate = body.join("\n");

if (fs.existsSync(`./server/models/${name}.js`)) {
  console.error(`Model ${name} already exists`)
  return
}

fs.writeFile(`./server/models/${name}.js`, schemaTemplate, err => {
  if (err) throw err;
  console.log(`Created model ${name}!`)
});
