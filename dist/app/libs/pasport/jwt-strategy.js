const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const config = require('config');
const db = require('./../../models');

passport.use(new Strategy({
    secretOrKey: config.get('jwtSecret'),
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
}, (jwtPayload, done) => {
    console.log('jwt', jwtPayload);
    db.Article.findById(jwtPayload.id)
        .then((user) => {
            done(null, user);
        }).catch((err) => {
            done(err, false);
        });
}))