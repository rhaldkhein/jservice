const express = require('express')
const { jservice } = require('../lib')
const registry = require('./services/registry')
const app = express()
const port = 3000

app.use(jservice(registry))

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

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}!`))