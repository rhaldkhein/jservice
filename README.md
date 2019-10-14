# JService

[![Build Status](https://travis-ci.org/rhaldkhein/jservice.svg?branch=master)](https://travis-ci.org/rhaldkhein/jservice) [![codecov](https://codecov.io/gh/rhaldkhein/jservice/branch/master/graph/badge.svg)](https://codecov.io/gh/rhaldkhein/jservice)

A small and powerful **pure javascript** DI container that is non-opinionated, no automatic dependency resolution, with dependency scoping such as Singleton, Scoped and Transient. Can optionally integrate with any Node web frameworks that supports middleware, like Express, Koa, Fasify, etc.

#### Manual Resolution

Does NOT require to configure which dependencies to resolve automatically into the function or class, but instead, only a single provider that can resolve services is injected. It's like manual resolution, but gives quicker coding and flexible dependency injection.

#### Dependency Scoping

- *Singleton* - services are the same across providers
- *Scoped* - services are the same within the provider but different on another instance of provider
- *Transient* - services are always different even within the same provider

#### Container Clustering

Build up a sub-containers that inherits dependecies from parent container. The sub-container can also hold its own dependency collection that is not accessable from parent container.

#### Dependency Declaration & Configuration

Isolate dependency declaration and configuration into a single file. Giving more control and ensure no implicit dependencies are leaked in.

#### Integration with Node Web Frameworks

Directly infuse web frameworks with dependency injection without changing the middleware's function signature.


## Install

```sh
npm install jservice
```

## Basic Usage

Using the core container without a web framework.

```javascript
var JService = require('jservice')
var DbService = require('./services/database')
var UserService = require('./services/user')

// Create a container
var jservice = JService.create()
// or var jservice = new JService()

// Add add services to container
function registry(services) {
  // DbService is a class or function constructor
  services.singleton(DbService, 'database')
  services.transient(UserService, 'user')
}

// Build services
jservice.build(registry)

// Resolve service via provider
var db = jservice.provider.service('database')
db.Books.find(123).then(book => console.log(book))
```

## Basic Integration Usage

Easily integrate with any web framework using middleware.

```javascript
var JService = require('jservice')
var express = require('express')
var app = express()
var registry = require('./registry')
var { IncomingMessage } = require('http')

// Create container with registry function
var jservice = JService.create(registry)

// Infuse jservice to express through middleware
app.use(jservice.init(IncomingMessage.prototype))

// Signup endpoint
app.post('/signup', (req, res) => {

  // Get the user service we registered in registry
  var user = req.service('user')

  // Using the service to create new user
  user.createNewUser({
    name: req.body.name,
    password: req.body.password
  }).then(() => res.json({ success: 'Ok' }))

})

// Start server when jservice is ready
jservice.start().then(() => app.listen(3000))
```

## Creating Services

A service can be a class, function, or concrete object. You basically don't need to do or set anything in the service. However, there are some options you can take, like explicitly putting the name and hook to startup events.

Basic ES5 service `user.js`, with no name and hooks using functional programming (vanilla service).

```javascript
function User(provider) {
  // Injecting database service
  var db = provider.service('database')
  // Exposed methods
  return {
    // Create user method
    createNewUser: function(data) {
      return db.User.create(data)
    }
  }
}
module.exports = User
```

Basic ES6 service `database.js` with name and hooks using class.

```javascript
import mongoose from 'mongoose'

class Database {
  // Set service name
  static get service() { return 'database' }
  // or
  // service = 'database'

  constructor(provider) {
    this.User = mongoose.model(
      'User',
      { name: String, password: String }
    )
  }
  // Hook to start event
  static start(provider) {
    // Wait to connect before invoking `ready` hook
    return mongoose.connect('mongodb://localhost:27017/test')
  }
  // ... more hooks
  // static setup(prov) { } // Trigger when service is added
  // static ready(prov) { } // Trigger after all services have started
}
```

## Registering Services

Create a file `registry.js` and add all the services.

```javascript
var Database = require('./services/database')
var User = require('./services/user')
// more service ...

module.exports = services => {
  // Add a singleton service, no need to set name as we set it already in the service
  services.singleton(Database)
  // Add a transient service, need to explicitly set name
  services.transient(User, 'user')
  // more services...
  services.scoped(Foo)
  services.add(Bar) // add() is an alias for singleton
  // We can also add a service multiple times but need to set different name
  services.add(Config, 'user-config')
  services.add(Config, 'database-config')

  // more...

  // Some services can be configured, like this
  services.configure(Database, provider => {
    // Here we get host and port from config
    var { host, port } = provider.get('database-config')
    // Or, you can also set it here
    // var host = 'localhost'
    // var port = 27000

    // Now, we tell database to use this
    return { host,  port }
  })
}
```

There are several ways to add registry

```javascript
// 1st option
var jservice = new JService(registry)
// 2nd option
var jservice = JService.create(registry)
// 3rd option
var jservice = new JService()
jservice.build(registry)
// 4th option
var jservice = JService.create()
jservice.build(registry)
jservice.build(moreRegistry)
```

## Service Scoping & Samples

In sample folder, you'll find various web framework integration samples and scope testing.

Notice the output ids generated when getting services. Same ids means the same instance.
- Singleton services have same id across providers
- Scoped services have same id within the request but different on subsequent request
- Transient services are always different (new instance)

```sh
GLOBAL SERVICE PROVIDER
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
npm run sample
```

## API

### Container (JService)

```javascript
const JService = require('jservice')
const container = JService.create() // Or "new JService()"
```

#### Properties

**.collection** `Collection` - service storage (add or disable services)
**.provider** `Provider` - service injector (get services)
**.isReady** `Boolean` - when start method is done

#### Methods

**.build(registry)**

Build up the container. Requires registry function that accepts the services `Collection`.
```javascript
container.build(services => {
  // `services` is instance of Collection
  services.add(MyService)
  // ...
})
```

**.init(prototype, opt = {})** | returns `middleware`

Binds JService to any web frameworks that supports middleware. Check out the samples folder for supported frameworks and sample usage.
```javascript
const express = require('express')
const { IncomingMessage } = require('http')
const app = express()
app.use(jservice.init(IncomingMessage.prototype))
jservice.start().then(() => app.listen(3000))
```

**.start()**

Starts the container, triggering all services that hooks to start event.

**.createContainer()** | returns new `Container`

Creates a sub-container that inherits all services from parent container.
```javascript
const container = JService.create()
const subContainer = container.createContainer()
```

**.createProvider()** | return new `Provider`

Create a scoped provider.


### Collection

**.singleton(service, name = null, deps = null)**

Alias: `.add(...)`

Adds a singleton service to collection. Can omit `name (string)` if the service contains static property `service = <name>`. Can also filter or customize dependencies available for the service using `deps (function)`
```javascript
services.singleton(ZooService, 'zoo', provider => {
  const customProvider = provider.create({
    other: provider.get('other'),
    custom: { foo: 'bar' }
  })
  return ZooService(customProvider)
})

// Custom 3rd party vanilla services
servics.add(express, 'express', provider => {
  return express()
})
```
**.transient(service, name = null, deps = null)**

Adds a transient mode service.

**.scoped(service, name = null, deps = null)**

Adds a scoped mode service.

**.configure(name, config)**

Configure a service. The `name` can be either string or function service, to identify which service to configure. The `config` is a function.

```javascript
services.configure(Database, provider => {
  // Get data from config service
  const config = provider.get('config')
  return {
    host: config.host,
    port: config.port
  }
})
```

**.enable(name, yes = true)**

Enable/disable a service.

### Provider

**.create(deps)**

Creates a sub (filtered) provider that only contains dependencies in `deps`

**.service(name)**

Alias: `.get(name)`

Strictly get a service. Throws error if service is not found.

**.serviceOrNull(name)**

Alias: `.getOrNull(name)`

Softly get a service. Will NOT throw error, but instead returns `null`.

## Mocking

```javascript
const { mock } = require('jservice')
// Import service to mock
const User = require('./user.js')
function FakeDatabase() { }

// Mock a provider with fake dependencies
const { provider } = mock(
  [FakeDatabase, 'db']
  // more ...
)

// Create instance of user service to test
new User(provider)
```

## License

MIT License
Copyright (c) 2019 RhaldKhein
