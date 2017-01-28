import { User } from 'models/user'
import { Auth } from 'services/auth'

export class Login {
  static inject () {
    return [Auth]
  }
  constructor (authorizationService) {
    this.authorizationService = authorizationService
    this.user = new User()
  }
  login () {
    if (this.user.email !== '' && this.user.password !== '') {
      this.authorizationService.auth(this.user)
    }
  }
}
