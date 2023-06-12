const express = require('express');
const connection = require('../connection.js');
const router = express.Router();

var auth = require('../services/authentication.js');
var checkRole = require('../services/checkRole.js');
