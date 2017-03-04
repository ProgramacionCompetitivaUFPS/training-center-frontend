import { MESSAGES } from 'config/config'
import { Alert, Auth } from 'services/services'

/**
 * RecoveryPassword (Module)
 * Módulo para la recuperación de contraseña.
 * Accesible via /#/recuperar-password/
 * @export
 * @class RecoveryPassword
 */
export class RecoveryPassword {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de Autenticación (Auth)
   */
  static inject () {
    return [Alert, Auth]
  }
  /**
   * Crea una instancia de RecoveryPassword.
   * @param {service} alertService - Servicio de notificaciones y mensajes
   * @param {service} authService - Servicio de autenticación y registro
   */
  constructor (alertService, authService) {
    this.alertService = alertService
    this.authService = authService
    this.email = ''
  }

  /**
   * Solicita al backend un cambio de contraseña para el correo dado.
   * De ser valido, el backend enviará un email para proceder con el cambio.
   */
  requestRecovery () {
    if (this.email !== '') {
      this.authService.requestRecovery(this.email)
        .then(() => {
          this.alertService.showMessage(MESSAGES.recoveryEmailSent)
        })
        .catch(error => {
          switch (error.status) {
            case 400:
              this.alertService.showMessage(MESSAGES.recoveryMailDoesNotExist)
              break
            case 500:
              this.alertService.showMessage(MESSAGES.serverError)
              break
            default:
              this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    }
  }
}
