const Koa = require('koa')
const { jservice } = require('../lib')
const registry = require('./services/registry')
const { default: koaAdapter } = require('../lib/adapters/koa')

const app = new Koa()

app.use(
  jservice(
    registry,
    koaAdapter(app.context)
  )
)

app.use(async ctx => {
  const singlA = ctx.service('singleton')
  const singlB = ctx.service('singleton')
  const scopeA = ctx.service('scoped')
  const scopeB = ctx.service('scoped')
  const transA = ctx.service('transient')
  const transB = ctx.service('transient')
  ctx.body = `
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
  `
})

app.listen(3000)