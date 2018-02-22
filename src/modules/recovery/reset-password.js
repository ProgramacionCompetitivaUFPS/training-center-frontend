import { inject } from 'aurelia-framework'
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

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth), Enrutamiento (Router)
@inject(Alert, Auth, Router)
export class ResetPassword {

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
    try {
      this.user.email = this.authorizationService.validateResetToken(this.user.token)
      this.tokenValid = true
    } catch (error) {
      if (error.message === 'invalid token') {
        this.alertService.showMessage(MESSAGES.recoveryInvalidToken)
      } else if (error.message === 'expired token') {
        this.alertService.showMessage(MESSAGES.recoveryExpiredToken)
      }
      this.router.navigate('recuperar-password')
    }
  }

  /**
   * Envia al servidor los datos para establecer una nueva contraseña
   */
  requestResetPassword () {
    if (this.user.password !== '' && this.user.confirmPassword === this.user.password) {
      this.authorizationService.resetPassword(this.user)
        .then(() => {
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
