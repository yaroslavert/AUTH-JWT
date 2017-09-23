const crypto = require('crypto');
const config = require('config');

module.exports = function (sequelize, DataTypes) {
    let user = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            } 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: DataTypes.STRING,
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
            // example on how to add relations
            // Article.hasMany(models.Comments);
            },
            isPassword: (password, cryptedPass, cryptoSalt) => {
                return crypto.pbkdf2Sync(
                    password,
                    cryptoSalt,
                    config.get('crypto.hash.iterations'),
                    config.get('crypto.hash.length'),
                    'sha1'
                ).toString('base64') === cryptedPass;
            }
        }
    });

    user.hook('beforeCreate', user=>{
        user.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('base64');
        user.password = crypto.pbkdf2Sync(
            user.password,
            user.salt,
            config.get('crypto.hash.iterations'),
            config.get('crypto.hash.length'),
            'sha1'
        ).toString('base64');
    });
    return user;
};

    