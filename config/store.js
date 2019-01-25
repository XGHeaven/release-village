const path = require('path')

const stores = process.env.STORES

try {
  const data = JSON.parse(stores)
  module.exports = data
} catch(e) {
  try {
    const data = require(path.resolve(process.cwd(), stores))
    module.exports = data
  } catch(e) {
    module.exports = []
  }
}
