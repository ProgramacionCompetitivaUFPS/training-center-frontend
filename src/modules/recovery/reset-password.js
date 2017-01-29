import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserReset } from 'models/models'
import { Alert, Auth } from 'services/services'

/**
 * ResetPassword (Module)
 * Módulo para el cambio de la contraseña, una vez se ha solicitado su recuperación.
 * @export
 * @class ResetPassword
 */
export class ResetPassword {
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
   * Crea una instancia de ResetPassword.
   * @param {service} alertService - Servicio de notificaciones y mensajes
   * @param {service} authService - Servicio de autenticación y registro
   * @param {service} router - Servicio de enrutamiento
   */
  constructor (alertService, authorizationService, router) {
    this.alertService = alertService
    this.authorizationService = authorizationService
    this.router = router
    this.user = new UserReset()
    this.tokenValid = false
  }

  /**
   * activate() es un método especial que se invoca justo antes que el enrutador active el componente.
   * En este caso, activate valida el token recibido y redirige al inicio de sesión si el token no es valido.
   * @param {any} params - Parametros del enrutamiento, entre ellos el token
   * @param {any} routeConfig - Configurción del enrutamiento
   */
  activate (params, routeConfig) {
    this.routeConfig = routeConfig
    this.user.token = params.token
    this.authorizationService.validateReset(this.user.token)
      .then(data => {
        this.tokenValid = true
        this.user.email = data.email
      })
      .catch(error => {
        switch (error.status) {
          case 400:
            this.alertService.showMessage(MESSAGES.recoveryInvalidToken)
            this.router.navigate('iniciar-sesion')
            break
          case 500:
            this.alertService.showMessage(MESSAGES.serverError)
            break
          default:
            this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Envia al servidor los datos para establecer una nueva contraseña
   */
  requestResetPassword () {
    if (this.user.password !== '' && this.user.confirmPassword === this.user.password) {
      this.authorizationService.resetPassword(this.user)
        .then(data => {
          this.alertService.showMessage(MESSAGES.recoveryCorrect)
          this.router.navigate('iniciar-sesion')
        }) // Si el cambio es exitoso, se redirige al inicio de sesión
        .catch(error => {
          switch (error.status) {
            case 400:
              this.alertService.showMessage(MESSAGES.recoveryDifferentPasswords)
              this.user.password = ''
              this.user.confirmPassword = ''
              break
            case 500:
              this.alertService.showMessage(MESSAGES.serverError)
              break
            default:
              this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    } else {
      this.alertService.showMessage(MESSAGES.recoveryDifferentPasswords)
      this.user.password = ''
      this.user.confirmPassword = ''
    }
  }
}
