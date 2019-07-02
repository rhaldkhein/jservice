const glob = require('glob')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const TransientService = require('./services/transient')
const ScopedService = require('./services/scoped')
const SingletonService = require('./services/singleton')
const BarService = require('./services/bar')
const BazService = require('./services/baz')
const FooService = require('./services/foo')

chai.use(chaiAsPromised)
global.expect = chai.expect
chai.should()

global.services = {
  TransientService,
  ScopedService,
  SingletonService,
  BarService,
  BazService,
  FooService
}

glob.sync('./lib/**/*.js').forEach(function (file) {
  require(path.resolve(file))
})

glob.sync('./test/suites/**/*.js').forEach(function (file) {
  require(path.resolve(file))
})