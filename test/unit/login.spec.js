import { Login } from '../../src/modules/login/login'

describe('El módulo de inicio de sesión', () => {
  let login

  beforeEach(() => {
    login = new Login()
  })
  it('se inicializa con usuario nulo', () => {
    expect(login.user.email).toBeNull()
  })
})
