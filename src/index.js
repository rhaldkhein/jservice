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
    return Promise.all(this._invoke('start'))
      .then(() => {
        this.isReady = true
        this._invoke('ready')
      })
      .then(() => this.provider)
  }

  _invoke(event) {
    let results = []
    const { services } = this.collection
    for (const key in services) {
      if (!services.hasOwnProperty(key)) continue
      const service = services[key]
      const method = service[event]
      if (method) {
        results.push(method(this.provider))
      }
    }
    return results
  }

}

export default Builder
export {
  Builder,
  ServiceCollection,
  ServiceProvider
}