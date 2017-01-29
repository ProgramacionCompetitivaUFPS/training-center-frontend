import { NotificationService } from 'aurelia-notify'

/**
 * Alert (Service)
 * Servicio que muestra notificaciones en pantalla
 * @export
 * @class Alert
 */
export class Alert {
  /**
   * Método que realiza inyección de las dependencias necesarias en el servicio.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio externo de notificaciones (NotificationService)
   */
  static inject () {
    return [NotificationService]
  }

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
    if (message.type === 'info') {
      this.notificationService.info(message.text)
    } else if (message.type === 'error') {
      this.notificationService.danger(message.text)
    } else if (message.type === 'success') {
      this.notificationService.success(message.text)
    } else if (message.type === 'warning') {
      this.notificationService.warning(message.text)
    }
  }
}
