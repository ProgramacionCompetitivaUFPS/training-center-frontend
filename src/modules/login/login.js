import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserLogIn } from 'models/models'
import { Alert, Auth, Jwt } from 'services/services'

export class Login {
  static inject () {
    return [Auth, Jwt, Router, Alert]
  }
  constructor (authorizationService, jwtService, router, alertService) {
    this.authorizationService = authorizationService
    this.jwtService = jwtService
    this.router = router
    this.alertService = alertService
    this.user = new UserLogIn()
  }
  login () {
    if (this.user.email !== '' && this.user.password !== '') {
      this.authorizationService.auth(this.user)
      .then((data) => {
        this.jwtService.save(data.token)
        this.router.navigate('')
      })
      .catch(error => {
        switch (error.status) {
          case 401:
            this.alertService.showMessage(MESSAGES.loginWrongData)
            this.user = new UserLogIn()
            break
          case 500:
            this.alertService.showMessage(MESSAGES.serverError)
            break
          default:
            this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
    } else {
      this.alertService.showMessage(MESSAGES.loginIncompleteData)
    }
  }
}
