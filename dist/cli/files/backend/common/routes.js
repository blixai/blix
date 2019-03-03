"use strict";
var express = require('express');
var r = express.Router();
module.exports = r;
var home = require('./controllers/home');
r.get('/', home.index);
