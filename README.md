# JService
A javascript DI container at its smallest form. Inspired by .Net Core.

### Install

```sh
npm install jservice
```

### Usage

Create entry point `index.js` to build and start the application.

```javascript
const { Builder } = require('jservice')
const registry = require('./registry')

// Create a container context
const builder = new Builder()

// Build services and start
builder.build(registry).start()
```

Create a registry file `registry.js` to add your all services.

```javascript
// Import your services
const Routing = require('./services/routing')
const Database = require('./services/database')
const Server = require('./services/server')
const User = require('./services/user')
const Parser = require('./services/parser')

// Export a function 
module.exports = function(services) {
  
  // Add your singleton services
  services.addService(Routing)
  services.addService(Database)
  services.addService(Server)
  services.addService(User)

  // Add your spoced service
  services.addScopeService(Parser)
}
```

#### Creating your services

Server service `./services/server.js`. Assume you're using `Express` and `ES6` through `Babel`.

```javascript
const express = require('express')
const http = require('http')

export default class Server {
  // Required static property
  static service = 'server'
  // Create express server
  constructor(provider) {
    // Inject the routing server
    this.routingService = provider.getService('routing')
    // Create server
    this.app = express()
    this.router = express.Router()
    this.server = http.Server(this.app)
  }
  // Start server and listen on port
  listen() {
    const setupRouting = () => {
      this.routingService.buildRoutes()
    }
    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = 3000
        // Start the server
        this.server.listen(port, err => {
          if (err) return reject(err)
          resolve()
          console.log(`Server is listening on port ${port}`);
        })
      })
    }
    return Promise.resolve()
      .then(setupRouting)
      .then(listenServer)
  }
  // This is an optional syntax sugar to hook on builder's start event.
  // You can start server in `builder.build(registry).start()` instead.
  static start(provider) {
    // Since this is static, we don't have access to `this` but we can
    // use the provider to get the server service.
    const serverService = provider.getService('server')
    serverService.listen()
  }
}
```

Routing service `./services/routing.js`. You will notice that we will not import `Express` here or create any routing object. The only job of this service is to map business logic to endpoints.

```javascript
export default class Routing {
  constructor(provider) {
    this.userService = provider.getService('user')
    this.serverService = provider.getService('server')
  }
  buildRoutes() {
    const { router } = this.serverService
    router.post('/register', (req, res) => {
      this.userService.registerUser(req.body)
    })
    router.post('/delete', (req, res) => {
      this.userService.deleteUser(req.body.id)
    })
  }
}
```