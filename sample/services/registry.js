const SingletonService = require('./singleton')
const ScopedService = require('./scoped')
const TransientService = require('./transient')

function Custom(a, b, c) {
  // console.log('A', a)
  console.log('B', b)
  console.log('C', c)
}

function User(p) {
  const c = p.get('custom')
  console.log(c)
}

User.ready = p => {
  p.get('user')
}

module.exports = services => {

  services.add(Custom, 'custom', () => {
    return [1, 2, 3]
  })
  services.singleton(SingletonService)
  services.scoped(ScopedService)
  services.transient(TransientService)
  services.singleton({ foo: 'bar' }, 'foo')

  services.add(User, 'user')

  // Add and configure more services

}
