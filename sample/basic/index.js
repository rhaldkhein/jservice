const { Builder } = require('../../build')
const registry = require('./registry')

const builder = new Builder()

builder
  .build(registry)
  .start()
  .then(provider => {

    console.log('\nMAIN PROVIDER')
    provider.getRequired('sing-a')

    console.log('\nSCOPED PROVIDER A')
    const scopedProviderA = builder.createScopedProvider()
    console.log('get <- sing-a', scopedProviderA.getService('sing-a'))
    console.log('get <- sing-a', scopedProviderA.getService('sing-a'))
    console.log('get <- scop-c', scopedProviderA.getService('scop-c'))
    console.log('get <- scop-c', scopedProviderA.getService('scop-c'))
    console.log('get <- tran-e', scopedProviderA.getService('tran-e'))
    console.log('get <- tran-e', scopedProviderA.getService('tran-e'))

    console.log('\nSCOPED PROVIDER B')
    const scopedProviderB = builder.createScopedProvider()
    console.log('get <- sing-a', scopedProviderB.getService('sing-a'))
    console.log('get <- sing-a', scopedProviderB.getService('sing-a'))
    console.log('get <- scop-c', scopedProviderB.getService('scop-c'))
    console.log('get <- scop-c', scopedProviderB.getService('scop-c'))
    console.log('get <- tran-e', scopedProviderB.getService('tran-e'))
    console.log('get <- tran-e', scopedProviderB.getService('tran-e'))

    // This will throw error as its a singleton provider
    // provider.getService('scop-c')

  })
