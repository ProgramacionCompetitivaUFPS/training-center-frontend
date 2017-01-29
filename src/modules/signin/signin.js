import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserSignIn } from 'models/models'
import { Alert, Auth } from 'services/services'

export class Signin {
  static inject () {
    return [Alert, Auth, Router]
  }
  constructor (alertService, authorizationService, router) {
    this.alertService = alertService
    this.authorizationService = authorizationService
    this.router = router
    this.user = new UserSignIn()
    this.user.type = 0
  }

  signin () {
    if (this.user.email != null && this.user.password != null && this.user.confirmPassword != null && this.user.name != null && this.user.username != null && this.user.type != null) {
      if (this.user.password === this.user.confirmPassword) {
        this.authorizationService.registerStudent(this.user)
          .then((data) => {
            this.alertService.showMessage(MESSAGES.signInCorrect)
            this.router.navigate('iniciar-sesion')
          })
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
      } else {
        this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
        this.user.password = ''
        this.user.confirmPassword = ''
      }
    } else {
      this.alertService.showMessage(MESSAGES.signInIncompleteData)
    }
  }
}
