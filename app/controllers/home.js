const express = require('express'),
  router = express.Router(),
  db = require('../models'),
  // jwt = require('jwt-simple'),
  config = require('config'),
  passport = require('./../libs/pasport'),
  jwt = require('jsonwebtoken');

module.exports = function (app) {
  app.use('/', router);
};
router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});
router.route('/articles')
  .get((req, res) => {
    db.Article.findAll().then(function (articles) {
      res.send(articles);
    });
  })
  .post((req, res) => {
    db.Article.create({
      title: req.body.title,
      url: req.body.url,
      text: req.body.title,
    }).then((user) => {
      let payload = {id: user.id};
      const token = jwt.sign(payload, config.get('jwtSecret'));
      res.send({token});
    }).catch((err) => {
      res.send(err);
    });
  });

router.route('/article/:id')
  .all(passport.authenticate('jwt', {session: false}))
  .all((req, res, next) => {
    db.Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        throw new Error();
      }
      req.user = article;
      next();
    }).catch((err) => {
      res.json({message: 'user not found'});
    })
  })
  .get((req, res) => {
    res.send(req.user);
  })
  .put((req, res) => {
    req.user.update(req.body).then(() => {
      res.send(200);
    }).catch((err) => {
      res.send(err);
    });
  });