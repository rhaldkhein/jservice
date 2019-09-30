const Koa = require('koa')
const JService = require('../lib')
const registry = require('./services/registry')

const app = new Koa()
const port = 3000
const jservice = new JService(registry)

app.use(jservice.init(app.context))

app.use(async ctx => {
  const singlA = ctx.service('singleton')
  const singlB = ctx.service('singleton')
  const scopeA = ctx.service('scoped')
  const scopeB = ctx.service('scoped')
  const transA = ctx.service('transient')
  const transB = ctx.service('transient')
  ctx.body = `
  <pre>
  
  Koa JService

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
  `
})

jservice.start()
  .then(() => {
    app.listen(port)
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`)
  })