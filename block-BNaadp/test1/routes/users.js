var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.cookie('bitopan', 1);
  res.send('Welcome');
});

module.exports = router;
