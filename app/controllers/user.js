const express = require('express');
const router = express.Router();
const db = require('../models');
const config = require('config');
const passport = require('./../libs/pasport');
const jwt = require('jsonwebtoken');

module.exports = function (app) {
    app.use('/user', router);
};

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(req.user);
});
router.get('/profile', (req, res) => {
    res.render('/');
});

router.post('/reg', (req, res) => {
    db.User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }).then((user) => {
        const token = jwt.sign({id: user.id}, config.get('jwtSecret'));
        res.send({token});
    }).catch((err) => {
        res.statusCode = 400;
        res.send(err);
    });
});
router.post('/login', (req, res) => {
    db.User.findOne({
        where: {
            email: req.body.email
        },
        attributes: ['id', 'password', 'salt']
    }).then(user => {
        if (user != null && db.User.isPassword(req.body.password, user.password, user.salt)) {
            const token = jwt.sign({id: user.id}, config.get('jwtSecret'));
            res.send({token});
        } else {
            res.statusCode = 404;
            res.json({message: 'user not found'});
        }
    }).catch((err) => {
        console.log('err', err);
        res.send(err);
    });
});