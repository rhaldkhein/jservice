const service = require('restana')({})
const { jservice } = require('../lib')
const registry = require('./services/registry')

service.use(jservice(registry))

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

service.start()