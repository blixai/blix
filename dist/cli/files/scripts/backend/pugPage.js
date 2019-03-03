"use strict";
var fs = require('fs');
var path = require('path');
var log = console.log;
var name = process.argv[2];
if (name) {
    name = name.toLowerCase();
}
else {
    console.log('No name provided. Try: npm run page <pageName> <subpage>');
    process.exit();
}
var pages = process.argv.splice(3, process.argv.length);
// probably should loop through and remove invalid page names
var pug = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8');
pug = pug.replace(/Name/g, name);
var css = "body {\n\tcolor: blue;\n}";
var js = "import './main.css'\nconsole.log('hello world')";
var createPages = function () {
    pages.forEach(function (page) {
        page = page.toLowerCase();
        if (fs.existsSync("./src/" + name + "/" + page)) {
            log("The folder " + page + " already exists");
        }
        else {
            var pageController = "\n\nexports." + page + " = (req, res) => {\n\tres.render('" + name + "/" + page + "', {})\n}";
            var pageRoute = "\nr.get('/" + name + "/" + page + "', " + name + "." + page + ")";
            // take a look at this write file
            var subPage = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8');
            subPage = subPage.replace(/Name/g, "../" + page);
            fs.writeFile("./server/views/" + name + "/" + page + ".pug", subPage, function (err) {
                if (err)
                    throw err;
                log("Created page " + page + " in server/views/" + page);
            });
            fs.appendFile('./server/routes.js', pageRoute, function (err) {
                if (err)
                    throw err;
                log("Added " + page + " route to routes.js");
            });
            fs.appendFile("./server/controllers/" + name + ".js", pageController, function (err) {
                if (err)
                    throw err;
                log("Added " + page + " to " + name + " controller");
            });
            fs.mkdirSync("./src/" + name + "/" + page);
            log("Created " + page + " folder in src/" + name + "/" + page);
            fs.writeFile("./src/" + name + "/" + page + "/index.js", js, function (err) {
                if (err)
                    throw err;
                log("Created index.js file in src/" + name + "/" + page);
            });
            fs.writeFile("./src/" + name + "/" + page + "/main.css", css, function (err) {
                if (err)
                    throw err;
                log("Created main.css file in src/" + name + "/" + page);
            });
            addEntry("" + page, name + "/" + page);
        }
    });
};
var newPage = function () {
    if (fs.existsSync("./src/" + name)) {
        createPages();
    }
    else {
        addEntry(name, name);
        fs.mkdirSync("./src/" + name);
        fs.mkdirSync("./server/views/" + name);
        fs.writeFile("./server/views/" + name + "/index.pug", pug, function (err) {
            if (err)
                throw err;
            log("Created index.pug file in server/views/" + name + "/index.pug");
        });
        var index = "exports.index = (req, res) => {\n\tres.render('" + name + "/index', {})\n}";
        var viewIndex = "exports." + name + " = (req, res) => {\n\tres.render('" + name + "/index', {})\n}";
        var pageRoute = void 0;
        if (fs.existsSync("./server/controllers/" + name + ".js")) {
            viewIndex = '\n\n' + viewIndex;
            fs.appendFile("./server/controllers/" + name + ".js", viewIndex, function (err) {
                if (err)
                    throw err;
            });
            pageRoute = "\n\nr.get('/" + name + "', " + name + "." + name + ")";
        }
        else {
            fs.writeFile("./server/controllers/" + name + ".js", index, function (err) {
                if (err)
                    throw err;
                log("Created controller " + name + " in server/controllers/" + name);
            });
            pageRoute = "\n\nconst " + name + " = require('./controllers/" + name + "')\nr.get('/" + name + "', " + name + ".index)";
        }
        fs.appendFile('./server/routes.js', pageRoute, function (err) {
            if (err)
                throw err;
            log("Added " + name + " route to server/routes.js");
        });
        fs.writeFile("./src/" + name + "/main.css", css, function (err) {
            if (err)
                throw err;
            log("Created " + name + " main.css file");
        });
        fs.writeFile("./src/" + name + "/index.js", js, function (err) {
            if (err)
                throw err;
            log("Created " + name + " index.js file");
        });
        createPages();
    }
};
var addEntry = function (name, path) {
    var body = fs.readFileSync('./webpack.config.js', 'utf8');
    if (body.includes("./src/" + path))
        return;
    var search = "entry: {";
    var index = body.indexOf(search);
    var newEntry = "\n\t\t" + name + ": './src/" + path + "',";
    var output;
    if (index !== -1) {
        output = [body.slice(0, index + 8), newEntry, body.slice(index + 8)].join('');
    }
    else {
        // entry is a string and not an object, need to convert to object to add new path
        console.log("Unable to add route to webpack.config.js");
        console.log('You need to change the webpack entry point into an object.');
        console.log("Then the entry key will be: " + name + " and the entry value will be ./src/" + path);
        console.log('To learn more checkout this link: https://webpack.js.org/concepts/entry-points/');
        process.exit();
    }
    try {
        fs.writeFileSync('./webpack.config.js', output, 'utf8');
        log("Add entry " + name + " to webpack.config.js");
    }
    catch (e) {
        log('Unable to create entry path in webpack.config.js');
    }
};
newPage();
