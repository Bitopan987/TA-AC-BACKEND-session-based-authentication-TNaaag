var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Product = require('../models/product');

router.get('/product/new', function (req, res, next) {
  console.log(req.user);
  if (req.user) {
    return res.render('productListingForm');
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

module.exports = router;
