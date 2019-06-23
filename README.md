# JService

A javascript DI container at its smallest form. Inspired by .Net Core with dependency scoping. Singleton, Scoped and Transient.

To see the scoped service in action, which binds to request object in Express. Check out [Excore](https://github.com/rhaldkhein/excore).

### Install

```sh
npm install jservice
```

### Usage

Create entry point `index.js` to build and start the application.

```javascript
const { Builder } = require('jservice')
const registry = require('./registry')
const runTest = require('./test')

// Create a container
const builder = new Builder()

// Build services and start
builder
  .build(registry)
  .start()
  .then(provider => runTest(provider, builder))

```

Add all your services in `registry.js` file.

```javascript
// Import services
const Server = require('./server')
const SingletonService = require('./services/singleton')
const ScopedService = require('./services/scoped')
const Transient = require('./services/transient')

module.exports = services => {

  // Add services
  services.addSingleton(SingletonService)
  services.addScoped(ScopedService)
  services.addTransient(Transient)

  services.addSingleton({ foo: 'bar' }, 'foo')
  services.addSingleton(Server)

}

```

To test the service, create `test.js` and run it after the builder started.

```javascript
module.exports = (provider, builder) => {

  console.log('MAIN PROVIDER')
  console.log('Singleton | ', provider.getService('singleton').id)

  console.log('SCOPED PROVIDER A (1st request)')
  const scopedProviderA = builder.createScopedProvider()
  console.log('Singleton | ', scopedProviderA.getService('singleton').id)
  console.log('Singleton | ', scopedProviderA.getService('singleton').id)
  console.log('Scoped    | ', scopedProviderA.getService('scoped').id)
  console.log('Scoped    | ', scopedProviderA.getService('scoped').id)
  console.log('Transient | ', scopedProviderA.getService('transient').id)
  console.log('Transient | ', scopedProviderA.getService('transient').id)

  console.log('SCOPED PROVIDER B (2nd request)')
  const scopedProviderB = builder.createScopedProvider()
  console.log('Singleton | ', scopedProviderB.getService('singleton').id)
  console.log('Singleton | ', scopedProviderB.getService('singleton').id)
  console.log('Scoped    | ', scopedProviderB.getService('scoped').id)
  console.log('Scoped    | ', scopedProviderB.getService('scoped').id)
  console.log('Transient | ', scopedProviderB.getService('transient').id)
  console.log('Transient | ', scopedProviderB.getService('transient').id)

  // This will throw error as its a global provider (singleton) that 
  // requires scoped service
  // provider.getService('scoped')
  // provider.getService('transient')

}
```

**Output:** Notice the ids generated when getting services. Same id means the same instance.
- Singleton services have same id across providers
- Scoped services have same id within the provider but different on another provider
- Transient services are always different (new instance)

```sh
GLOBAL PROVIDER
Singleton |  plgcGPuZu

SCOPED PROVIDER A (1st request)
Singleton |  plgcGPuZu
Singleton |  plgcGPuZu
Scoped    |  8YG0POVDjR
Scoped    |  8YG0POVDjR
Transient |  ZAoy3AJooc
Transient |  ok1MP0cYir

SCOPED PROVIDER B (2nd request)
Singleton |  plgcGPuZu
Singleton |  plgcGPuZu
Scoped    |  TQPz6T_Suk
Scoped    |  TQPz6T_Suk
Transient |  sPsB8hnC3U
Transient |  8iz9mz8bC9
```

You check out the sample and run it yourself.

```sh
git clone <repo>
npm install
npm run build
npm run sample
```

#### License

MIT