import { MESSAGES } from 'config/config'
import { Alert, Auth } from 'services/services'

export class RecoveryPassword {
  static inject () {
    return [Alert, Auth]
  }
  constructor (alertService, authService) {
    this.alertService = alertService
    this.authService = authService
    this.email = ''
  }

  requestRecovery () {
    if (this.email !== '') {
      this.authService.requestRecovery(this.email)
        .then(data => {
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
              console.log(error)
              this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    }
  }
}
