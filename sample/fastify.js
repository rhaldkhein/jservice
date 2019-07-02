const JService = require('../lib')
const registry = require('./services/registry')

const fastify = require('fastify')()

const jservice = new JService(registry)
fastify.use(jservice.init())

// Declare a route
fastify.get('/', function (request, reply) {
  const singlA = request.raw.service('singleton')
  const singlB = request.raw.service('singleton')
  const scopeA = request.raw.service('scoped')
  const scopeB = request.raw.service('scoped')
  const transA = request.raw.service('transient')
  const transB = request.raw.service('transient')
  reply.send(`
  Fastify JService

  Services  |  Id
  - - - - - | - - - - - -
  Singleton |  ${singlA.id}
  Singleton |  ${singlB.id}
  Scoped    |  ${scopeA.id}
  Scoped    |  ${scopeB.id}
  Transient |  ${transA.id}
  Transient |  ${transB.id}

  Hit reload and compare the ids
  `)
})

// Run the server!
jservice.start()
  .then(() => {
    fastify.listen(3000, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      // eslint-disable-next-line no-console
      console.log(`Listening on ${address}`)
    })
  })