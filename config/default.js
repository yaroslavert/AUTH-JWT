module.exports = {
  jwtSecret: 'my secretKey is 228335',
  crypto: {
    hash: {
      length:     128,
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  }
}
