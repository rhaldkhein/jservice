/* eslint-disable no-console */

const JService = require('../lib')
const registry = require('./services/registry')

const container = new JService()

container
  .build(registry)
  .start()
  .then(runTest)

function runTest(provider) {
  console.log('\nMAIN PROVIDER')
  console.log('Singleton | ', provider.service('singleton').id)

  console.log('\nSCOPED PROVIDER A (1st request)')
  const scopedProviderA = container.createProvider()
  console.log('Singleton | ', scopedProviderA.service('singleton').id)
  console.log('Singleton | ', scopedProviderA.service('singleton').id)
  console.log('Scoped    | ', scopedProviderA.service('scoped').id)
  console.log('Scoped    | ', scopedProviderA.service('scoped').id)
  console.log('Transient | ', scopedProviderA.service('transient').id)
  console.log('Transient | ', scopedProviderA.service('transient').id)

  console.log('\nSCOPED PROVIDER B (2nd request)')
  const scopedProviderB = container.createProvider()
  console.log('Singleton | ', scopedProviderB.service('singleton').id)
  console.log('Singleton | ', scopedProviderB.service('singleton').id)
  console.log('Scoped    | ', scopedProviderB.service('scoped').id)
  console.log('Scoped    | ', scopedProviderB.service('scoped').id)
  console.log('Transient | ', scopedProviderB.service('transient').id)
  console.log('Transient | ', scopedProviderB.service('transient').id)

  // This will throw error as its a singleton provider
  // provider.service('scop-c')
}