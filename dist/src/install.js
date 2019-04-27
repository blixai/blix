"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var ora = require('ora');
var child_process_1 = require("child_process");
var store = require('./store');
var inquirer = require('inquirer');
var prompt = inquirer.prompt;
var process_1 = require("./process");
var blixInternal_1 = require("../.internal/blixInternal");
var fs_1 = require("./fs");
var logger_1 = require("./logger");
function canUseYarn() {
    if (fs.existsSync('yarn.lock')) {
        store.useYarn = true;
        return true;
    }
    else if (fs.existsSync('package-lock.json')) {
        store.useYarn = false;
        return false;
    }
    try {
        child_process_1.execSync("yarnpkg --version", { stdio: "ignore" });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.canUseYarn = canUseYarn;
var yarnPrompt = {
    type: 'confirm',
    message: 'Do you want to use Yarn to install packages',
    name: "yarn"
};
function yarn() {
    return __awaiter(this, void 0, void 0, function () {
        var yarnAnswer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(canUseYarn() && store.useYarn === '')) return [3 /*break*/, 2];
                    return [4 /*yield*/, prompt([yarnPrompt])];
                case 1:
                    yarnAnswer = _a.sent();
                    store.useYarn = yarnAnswer.yarn;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.yarn = yarn;
function checkScriptsFolderExist() {
    if (!fs.existsSync('./scripts')) {
        fs_1.mkdirSync('scripts');
        fs_1.mkdirSync('scripts/templates');
    }
    else if (!fs.existsSync('./scripts/templates')) {
        fs_1.mkdirSync('scripts/templates');
    }
}
exports.checkScriptsFolderExist = checkScriptsFolderExist;
function checkIfScriptIsTaken(scriptName) {
    try {
        var buffer = fs.readFileSync('./package.json');
        var packageJson = JSON.parse(buffer);
        return scriptName in packageJson['scripts'];
    }
    catch (err) {
        blixInternal_1._logCaughtError("Error finding " + scriptName + " in package.json", err);
        return false;
    }
}
exports.checkIfScriptIsTaken = checkIfScriptIsTaken;
function installAllPackages() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!store.dependencies) return [3 /*break*/, 2];
                    return [4 /*yield*/, installDependencies(store.dependencies)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!store.devDependencies) return [3 /*break*/, 4];
                    return [4 /*yield*/, installDependencies(store.devDependencies, 'dev')];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.installAllPackages = installAllPackages;
function addScriptToPackageJSON(command, script) {
    var filePath = '';
    if (store.name) {
        filePath = "./" + store.name + "/package.json";
    }
    else {
        filePath = './package.json';
    }
    try {
        var buffer = fs.readFileSync(filePath);
        var json = JSON.parse(buffer);
        json.scripts[command] = script;
        var newPackage = JSON.stringify(json, null, 2);
        fs.writeFileSync(filePath, newPackage);
        logger_1.logInsert(command + " script into package.json");
    }
    catch (err) {
        blixInternal_1._logCaughtError("Failed to add script " + command + " to package.json", err);
    }
}
exports.addScriptToPackageJSON = addScriptToPackageJSON;
;
function installDependencies(packages, type) {
    return __awaiter(this, void 0, void 0, function () {
        var spinnerText, spinner, command, command, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spinnerText = type === 'dev' ? ' Downloading development dependencies' : ' Downloading dependencies';
                    spinner = ora(spinnerText).start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (store.name) {
                        process.chdir("./" + store.name);
                    }
                    if (!store.useYarn) return [3 /*break*/, 3];
                    command = type === 'dev' ? "yarn add " + packages + " --dev" : "yarn add " + packages;
                    return [4 /*yield*/, process_1.execute(command)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    command = type === 'dev' ? "npm install --save-dev " + packages : "npm install --save " + packages;
                    return [4 /*yield*/, process_1.execute(command)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (store.name)
                        process.chdir('../');
                    spinner.succeed();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    if (store.name)
                        process.chdir('../');
                    spinner.fail();
                    blixInternal_1._logCaughtError('Something went wrong while installing the packages', err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.installDependencies = installDependencies;
;
/**
 *
 * @param {string} deps - string of space separated packages to install
 * @param type - string of any kind, usually 'dev' to indicate to add as a devDependency
 */
function addDependenciesToStore(deps, type) {
    if (type) {
        if (!store.devDependencies) {
            store.devDependencies = deps;
        }
        else {
            store.devDependencies += ' ' + deps;
        }
    }
    if (!type) {
        if (!store.dependencies) {
            store.dependencies = deps;
        }
        else {
            store.dependencies += ' ' + deps;
        }
    }
}
exports.addDependenciesToStore = addDependenciesToStore;
