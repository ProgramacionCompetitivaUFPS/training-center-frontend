//Dependencias
import { Router } from 'aurelia-router'
import { NotificationService } from 'aurelia-notify'
import { Alert, Auth } from 'services/services'
import { MESSAGES } from 'config/config'
import { UserSignIn } from 'models/models'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'
//Módulo a testear
import { Signin } from 'modules/signin/signin'

describe('El modulo de registro (Signin)', () => {
  let alertService = new Alert(new NotificationService())
  let authService = new Auth(new Http(), new Jwt())
  let routerService = new Router()
  let signinModule

  beforeEach(() => {
    signinModule = new Signin(alertService, authService, routerService)
  })

  it('Inicializa con un usuario de datos vacios', () => {
    let user = new UserSignIn()
    user.type = 0
    expect(signinModule.user).toEqual(user)
  })

  it('Registrar con datos vacios lanza un mensaje de datos incompletos', () => {
    spyOn(signinModule.alertService, 'showMessage')
    signinModule.signin()
    expect(signinModule.alertService.showMessage).toHaveBeenCalledWith(MESSAGES.signInIncompleteData)
  })

  it('Registrar con contraseñas diferentes lanza un mensaje de no coincidencia', () => {
    spyOn(signinModule.alertService, 'showMessage')
    signinModule.user = new UserSignIn('user@email.com', '1234', '4321', 'Usuario', 'user', '1234', 0)
    signinModule.signin()
    expect(signinModule.alertService.showMessage).toHaveBeenCalledWith(MESSAGES.signInDifferentPasswords)
  })

  it('Registrar un usuario valido redirige al servicio de autenticación para su registro', () => {
    spyOn(signinModule.authorizationService, 'registerStudent').and.callThrough()
    let user = new UserSignIn('user@email.com', '1234', '1234', 'Usuario', 'user', '1234', 0)
    signinModule.user = user
    signinModule.signin()
    expect(signinModule.authorizationService.registerStudent).toHaveBeenCalledWith(user)
  })
})
