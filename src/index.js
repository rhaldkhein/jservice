import ServiceCollection from './collection'
import ServiceProvider from './provider'

class Builder {

  collection = null
  provider = null
  isReady = false

  constructor() {
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection)
  }

  build(registry) {
    this.collection.addSingleton(this, '$core')
    if (typeof registry === 'function')
      registry(this.collection)
    return this
  }

  start() {
    return Promise.all(this.invoke('start'))
      .then(() => {
        this.isReady = true
        this.invoke('ready')
      })
      .then(() => this.provider)
  }

  invoke(event) {
    let results = []
    const { services } = this.collection
    services.forEach(service => {
      const method = service[event]
      if (method) results.push(method(this.provider))
    });
    return results
  }

}

export default Builder
export {
  Builder,
  ServiceCollection,
  ServiceProvider
}