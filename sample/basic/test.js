
module.exports = (provider, builder) => {

  console.log('\nMAIN PROVIDER')
  console.log('Singleton | ', provider.getService('singleton').id)

  console.log('\nSCOPED PROVIDER A (1st request)')
  const scopedProviderA = builder.createScopedProvider()
  console.log('Singleton | ', scopedProviderA.getService('singleton').id)
  console.log('Singleton | ', scopedProviderA.getService('singleton').id)
  console.log('Scoped    | ', scopedProviderA.getService('scoped').id)
  console.log('Scoped    | ', scopedProviderA.getService('scoped').id)
  console.log('Transient | ', scopedProviderA.getService('transient').id)
  console.log('Transient | ', scopedProviderA.getService('transient').id)

  console.log('\nSCOPED PROVIDER B (2nd request)')
  const scopedProviderB = builder.createScopedProvider()
  console.log('Singleton | ', scopedProviderB.getService('singleton').id)
  console.log('Singleton | ', scopedProviderB.getService('singleton').id)
  console.log('Scoped    | ', scopedProviderB.getService('scoped').id)
  console.log('Scoped    | ', scopedProviderB.getService('scoped').id)
  console.log('Transient | ', scopedProviderB.getService('transient').id)
  console.log('Transient | ', scopedProviderB.getService('transient').id)

  // This will throw error as its a singleton provider
  // provider.getService('scop-c')

}