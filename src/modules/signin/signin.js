import { User } from 'models/user'
import { Auth } from 'services/auth'

export class Signin {
  static inject () {
    return [Auth]
  }
  constructor (authService) {
    this.user = new User()
  }
}
