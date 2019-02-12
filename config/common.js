const env = process.env

module.exports = {
  // TODO: not use
  port: parseInt(env.PORT || '3000', 10),
  urlPrefix: env.URL_PREFIX || 'http://localhost:3000'
}
