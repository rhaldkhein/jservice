const express = require('express')
const JService = require('../lib')
const registry = require('./services/registry')
const { connectAdapter } = require('../lib/adapters')
const { IncomingMessage } = require('http')

const app = express()
const port = 3000
const jservice = new JService(registry)

app.use(jservice.init(
  connectAdapter(IncomingMessage.prototype)
))

app.get('/', (req, res) => {
  const singlA = req.service('singleton')
  const singlB = req.service('singleton')
  const scopeA = req.service('scoped')
  const scopeB = req.service('scoped')
  const transA = req.service('transient')
  const transB = req.service('transient')
  res.send(`
  <pre>
  
  Express JService

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
    app.listen(port)
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`)
  })