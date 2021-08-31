var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Article = require('../models/article');
var Comments = require('../models/comments');

router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('articles', { articles: articles });
  });
});

router.get('/new', (req, res) => {
  if (req.session.userId) {
    res.render('addArticle');
  } else {
    req.flash('error', 'You must login to create new article');
    res.redirect('/users/login');
  }
});

router.post('/', (req, res, next) => {
  req.body.author = req.session.userId;
  req.body.tags = req.body.tags.trim().split(' ');
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
});

router.get('/:slug', (req, res, next) => {
  console.log(req.session);
  if (!req.session.userId) {
    req.flash('error', 'You must login to see blog details');
    return res.redirect('/users/login');
  }
  let givenSlug = req.params.slug;
  Article.findOne({ slug: givenSlug })
    .populate('comments')
    .populate('author')
    .exec((err, article) => {
      console.log(err, article);
      if (err) return next(err);
      res.render('articleDetails', { article: article });
    });
});

module.exports = router;
