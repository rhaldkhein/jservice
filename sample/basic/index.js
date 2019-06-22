const { Builder } = require('../../build')
const registry = require('./registry')
const runTest = require('./test')

const builder = new Builder()

builder
  .build(registry)
  .start()
  .then(provider => runTest(provider, builder))
