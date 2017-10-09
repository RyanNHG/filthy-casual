const fs = require('fs')

module.exports =
  fs.readFileSync('./schema.graphql', { encoding: 'utf-8' })
