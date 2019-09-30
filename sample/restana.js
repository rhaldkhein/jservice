const rastana = require('restana')
const JService = require('../lib')
const registry = require('./services/registry')
const { IncomingMessage } = require('http')

const service = rastana({})
const jservice = new JService(registry)

service.use(jservice.init(IncomingMessage.prototype))

service.get('/', (req, res) => {
  const singlA = req.service('singleton')
  const singlB = req.service('singleton')
  const scopeA = req.service('scoped')
  const scopeB = req.service('scoped')
  const transA = req.service('transient')
  const transB = req.service('transient')
  res.send(`
  <pre>
  
  Restana JService

  Services  |  Id
  - - - - - | - - - - - -
  Singleton |  ${singlA.id}
  Singleton |  ${singlB.id}
  Scoped    |  ${scopeA.id}
  Scoped    |  ${scopeB.id}
  Transient |  ${transA.id}
  Transient |  ${transB.id}

  Hit reload and compare the ids
  </pre>
  `)
})

jservice.start()
  .then(() => {
    service.start()
    // eslint-disable-next-line no-console
    console.log('Listening on port 3000')
  })