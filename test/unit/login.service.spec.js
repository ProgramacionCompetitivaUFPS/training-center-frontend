//Dependencias
import { Router } from 'aurelia-router'
import { NotificationService } from 'aurelia-notify'
import { Alert, Auth } from 'services/services'
import { MESSAGES } from 'config/config'
import { UserLogIn } from 'models/models'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'
//Módulo a testear
import { Login } from 'modules/login/login'

describe('El módulo login', () => {
  let alertService = new Alert(new NotificationService())
  let authService = new Auth(new Http(), new Jwt())
  let routerService = new Router()
  let loginModule

  beforeEach(() => {
    loginModule = new Login(alertService, authService, routerService)
  })

  it('El módulo inicia con un usuario con datos nulos (email y password)', () => {
    expect(loginModule.user.email).toBeNull()
    expect(loginModule.user.password).toBeNull()
  })

  it('Iniciar sesión con datos vacios lanza un mensaje de datos incompletos', () => {
    spyOn(loginModule.alertService, 'showMessage')
    loginModule.login()
    expect(loginModule.alertService.showMessage).toHaveBeenCalledWith(MESSAGES.loginIncompleteData)
  })

  it('Iniciar sesión con email vacio lanza un mensaje de datos incompletos', () => {
    spyOn(loginModule.alertService, 'showMessage')
    loginModule.user.email = 'user@email.com'
    loginModule.login()
    expect(loginModule.alertService.showMessage).toHaveBeenCalledWith(MESSAGES.loginIncompleteData)
  })

  it('Iniciar sesión con contraseña vacia lanza un mensaje de datos incompletos', () => {
    spyOn(loginModule.alertService, 'showMessage')
    loginModule.user.password = '1234'
    loginModule.login()
    expect(loginModule.alertService.showMessage).toHaveBeenCalledWith(MESSAGES.loginIncompleteData)
  })

  it('Iniciar sesión con datos válidos envia al servicio de autenticación con los datos de usuario', done => {
    spyOn(loginModule.authorizationService, 'auth').and.callThrough()
    let user = new UserLogIn('user@email.com', '1234')
    loginModule.user = user
    loginModule.login()
    expect(loginModule.authorizationService.auth).toHaveBeenCalledWith(user)
    done()
  })

})
