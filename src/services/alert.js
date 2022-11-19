import { inject } from 'aurelia-framework'
import { NotificationService } from 'aurelia-notify'

/**
 * Alert (Service)
 * Servicio que muestra notificaciones en pantalla
 * @export
 * @class Alert
 */
@inject(NotificationService)
export class Alert {

  /**
   * Crea una instancia de Alert.
   * @param {service} notificationService - Servicio externo de notificaciones
   */
  constructor (notificationService) {
    this.notificationService = notificationService
  }

  /**
   * Muestra un mensaje en pantalla
   * @param {JSON} message - El mensaje a mostrar debe contener dos campos: type, que indica
   * el tipo de mensaje (info, error, warning o success), y text, con el texto del mensaje
   */
  showMessage (message) {
    const config = {
          timeout: 5000, 
          append:true,
          limit: 1
        }

    if (message.type === 'info') {
      this.notificationService.info(message.text, config)
    } else if (message.type === 'error') {
      this.notificationService.danger(message.text, config)
    } else if (message.type === 'success') {
      this.notificationService.success(message.text, config)
    } else if (message.type === 'warning') {
      this.notificationService.warning(message.text, config)
    }
  }
}
