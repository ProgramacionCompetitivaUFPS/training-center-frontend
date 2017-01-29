import { NotificationService } from 'aurelia-notify'

export class Alert {
  static inject () {
    return [NotificationService]
  }

  constructor (notificationService) {
    this.notificationService = notificationService
  }

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
