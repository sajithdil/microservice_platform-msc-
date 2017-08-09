var express = require('express');
var router = express.Router();

var requestify = require('requestify');
var mysql      = require('mysql');

<<swagger>>

router.post('/', function(req, res, next) {
    
    <<@@logic@@>>
});

module.exports = router;
