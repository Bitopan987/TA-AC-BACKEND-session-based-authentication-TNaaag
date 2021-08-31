var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Article = require('../models/article');
var Comment = require('../models/comments');

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

// update Article

router.get('/:slug/edit', (req, res, next) => {
  let givenSlug = req.params.slug;
  Article.findOne({ slug: givenSlug }, (err, article) => {
    if (err) return next(err);
    res.render('editArticle', { article });
  });
});

router.post('/:slug', (req, res, next) => {
  let givenSlug = req.params.slug;
  req.body.tags = req.body.tags.trim().split(' ');
  Article.findOneAndUpdate({ givenSlug }, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
});

// Delete

router.get('/:slug/delete', (req, res, next) => {
  let givenSlug = req.params.slug;
  console.log(givenSlug);
  Article.findOneAndDelete({ slug: givenSlug }, (err, deletedArticle) => {
    if (err) return next(err);
    res.redirect('/articles');
    // Comment.deleteMany({ articleId: deletedArticle._id }, (err, info) => {
    //   if (err) return next(err);
    //   res.redirect('/articles');
    // });
  });
});

// Increment Likes

router.get('/:slug/likes', (req, res, next) => {
  let givenSlug = req.params.slug;

  Article.findOneAndUpdate(
    { slug: givenSlug },
    { $inc: { likes: 1 } },
    (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/' + givenSlug);
    }
  );
});

router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  req.body.author = req.session.userId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        let givenSlug = updatedArticle.slug;
        res.redirect('/articles/' + givenSlug);
      }
    );
  });
});

module.exports = router;
