import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserSignIn } from 'models/models'
import { Alert, Auth } from 'services/services'

/**
 * Signin (module)
 * Módulo para el registro de estudiantes
 * @export
 * @class Signin
 */

//dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth), Enrutamiento (Router)
@inject(Alert, Auth, Router)
export class Signin {

  /**
   * Crea una instancia de Signin.
   * @param {service} alertService - Servicio de notificaciones y mensajes
   * @param {service} authService - Servicio de autenticación y registro
   * @param {service} router - Servicio de enrutamiento
   */
  constructor (alertService, authorizationService, router) {
    this.alertService = alertService
    this.authorizationService = authorizationService
    this.router = router
    this.user = new UserSignIn()
    this.user.code = 0
    this.user.type = 0
    this.isValidEmail = false
  }

  /**
   * Envia al servidor los datos del nuevo usuario a registrar.
   */
  signin () {
    if (this.user.isValid()) {
      if (this.user.password === this.user.confirmPassword) {
        this.authorizationService.registerStudent(this.user)
          .then(() => {
            this.alertService.showMessage(MESSAGES.signInCorrect)
            this.router.navigate('iniciar-sesion')
          }) // Si el registro es correcto se redirige al inicio de sesión
          .catch((error) => {
            switch (error.status) {
              case 400:
                this.alertService.showMessage(MESSAGES.signInWrongData)
                break
              case 401:
                this.alertService.showMessage(MESSAGES.permissionsError)
                break
              case 500:
                this.alertService.showMessage(MESSAGES.serverError)
                break
              default:
                this.alertService.showMessage(MESSAGES.unknownError)
            }
          })
      } else { // Si las contraseñas no coinciden, ambas se reinician para ingresarlas de nuevo
        this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
        this.user.password = ''
        this.user.confirmPassword = ''
      }
    } else if(this.user.username.length < 6) {
      this.alertService.showMessage(MESSAGES.usernameInvalid)
    }else {
      this.alertService.showMessage(MESSAGES.signInIncompleteData)
    }
  }

  validEmail() {
    if(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.user.email)) this.isValidEmail = true
    else this.isValidEmail = false
  }
}
