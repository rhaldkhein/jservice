const { Builder } = require('../../build')
const registry = require('./registry')

const builder = new Builder()

builder
  .build(registry)
  .start()