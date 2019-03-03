"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var enzyme_1 = require("enzyme");
var enzyme_2 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
enzyme_2.default.configure({ adapter: new enzyme_adapter_react_16_1.default() });
var Router_1 = require("../src/Router");
describe('Router', function () {
    var mockFn = jest.fn();
    it('Router Mounts without Crashing', function () {
        var Container = enzyme_1.shallow(<Router_1.default />);
    });
});
