import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserReset } from 'models/models'
import { Alert, Auth } from 'services/services'

export class ResetPassword {
  static inject () {
    return [Alert, Auth, Router]
  }
  constructor (alertService, authorizationService, router) {
    this.alertService = alertService
    this.authorizationService = authorizationService
    this.router = router
    this.user = new UserReset()
    this.tokenValid = false
  }

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

  requestResetPassword () {
    if (this.user.password !== '' && this.user.confirmPassword === this.user.password) {
      this.authorizationService.resetPassword(this.user)
        .then(data => {
          this.alertService.showMessage(MESSAGES.recoveryCorrect)
          this.router.navigate('iniciar-sesion')
        })
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
