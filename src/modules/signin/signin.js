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
export class Signin {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de Autenticación (Auth), Enrutamiento (Router)
   */
  static inject () {
    return [Alert, Auth, Router]
  }
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
    this.user.type = 0
  }

  /**
   * Envia al servidor los datos del nuevo usuario a registrar.
   */
  signin () {
    if (this.user.email != null && this.user.password != null && this.user.confirmPassword != null && this.user.name != null && this.user.username != null && this.user.type != null) {
      if (this.user.password === this.user.confirmPassword) {
        this.authorizationService.registerStudent(this.user)
          .then((data) => {
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
    } else {
      this.alertService.showMessage(MESSAGES.signInIncompleteData)
    }
  }
}
