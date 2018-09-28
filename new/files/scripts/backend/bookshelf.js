let fs = require("fs");
let path = require("path");
let modelName = process.argv[2];
const execSync = require("child_process").execSync;
let tableColumns = process.argv.splice(3, process.argv.length);

if (!modelName) {
  console.log("no model name provided");
  process.exit();
}

modelName = modelName.toLowerCase();
modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

let bookshelf = fs.readFileSync(
  path.resolve(__dirname, "./templates/bookshelf.js"),
  "utf8"
);
bookshelf = bookshelf.replace(
  /LowerCasePlural/g,
  `${modelName.toLowerCase()}s`
);
bookshelf = bookshelf.replace(/ModelName/g, modelName);
fs.writeFile(`./server/models/${modelName}.js`, bookshelf, err => {
  if (err) return console.error(err);
  console.log(`Created Model ${modelName}`);
});

try {
  execSync(`knex migrate:make ${modelName.toLowerCase()}s`);
} catch (e) {
  console.error(e);
  process.exit(1)
}

let migration = fs.readFileSync(
  path.resolve(__dirname, "./templates/migration.js"),
  "utf8"
);
migration = migration.replace(/Name/g, `${modelName.toLowerCase()}s`);

let possibleFields = [
  "string",
  "binary",
  "boolean",
  "date",
  "dateTime",
  "decimal",
  "float",
  "integer",
  "bigInteger",
  "text",
  "json",
  "jsonb"
];

let fields = [];
tableColumns.map(field => {
  if (field.includes(":")) {
    field = field.toLowerCase();
    let check = field.split(":");
    if (possibleFields.includes(check[1])) {
      let newLine = `t.${check[1]}('${check[0]}')`;
      fields.push(newLine);
    }
  }
});

let body = migration.toString().split("\n");

for (let i = fields.length - 1; i >= 0; --i) {
  body.splice(4, 0, `\u0020\u0020\u0020\u0020\u0020\u0020${fields[i]}`);
}

migration = body.join("\n");

fs.readdir("./db/migrations", (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    if (files[i].indexOf(`${modelName.toLowerCase()}`) !== -1) {
      fs.truncate(`./db/migrations/${files[i]}`, 0, () => {
        fs.writeFile(`./db/migrations/${files[i]}`, migration, err => {
          if (err) throw err;
          console.log(`Created migration file ${files[i]}`);
        });
      });
    }
  }
});
