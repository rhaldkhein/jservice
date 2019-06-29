const { Builder, ServiceProvider, ServiceCollection } = require('../../lib')

describe('builder', () => {

  const builder = new Builder()

  it('initial state', () => {
    expect(builder.isReady).to.be.false
    expect(builder.collection).to.exist
    expect(builder.provider).to.exist
  })

  it('start normally', () => {
    return builder
      .build(services => {
        services.should.be.instanceOf(ServiceCollection)
      })
      .start().should.eventually.be.instanceOf(ServiceProvider)
  })

  it('create scoped provider', () => {
    const provider = builder.createScopedProvider()
    expect(provider).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.equal(builder.provider)
    expect(provider).to.be.not.equal(builder.provider)
  })

})