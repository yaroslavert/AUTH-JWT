var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: '13'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:12345@localhost/auth-development'
  },

  test: {
    root: rootPath,
    app: {
      name: '13'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:12345@localhost/auth'
  },

  production: {
    root: rootPath,
    app: {
      name: '13'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:12345@localhost/auth-production'
  }
};

module.exports = config[env];
