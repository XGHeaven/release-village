const path = require('path')

module.exports = {
  tmpDir: process.env.DOWNLOAD_TMP_DIR || path.join(__dirname, '..', 'runtime', 'download'),
  proxy: process.env.HTTP_PROXY || process.env.http_proxy || process.env.HTTPS_PROXY || process.env.https_proxy || ''
}
