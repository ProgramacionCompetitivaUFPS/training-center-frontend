import { API } from 'config/config'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

export class Auth {

  static inject () {
    return [Http, Jwt]
  }

  constructor (httpService, jwtService) {
    this.httpService = httpService
    this.jwtService = jwtService
  }
  auth (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.auth, {
        method: 'post',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  registerStudent (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.users, {
        method: 'post',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  requestRecovery (email) {
    return this.httpService.httpClient
      .fetch(API.endponts.recovery, {
        method: 'get',
        body: {email: email}
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  validateReset (token) {
    return this.httpService.httpClient
      .fetch(API.endponts.reset, {
        method: 'post',
        body: {token: token}
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  resetPassword (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.reset, {
        method: 'PATCH',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  logout () {
    window.localStorage[API.tokenName] = null
    this.authorization = null
  }

  isAuthenticated () {
    return this.authorization !== null
  }

  isStudent () {
    return this.jwtService.getUserType() === 'student'
  }

  isCoach () {
    return this.jwtService.getUserType() === 'coach'
  }

  isAdmin () {
    return this.jwtService.getUserType() === 'admin'
  }

  isVisitor () {
    return this.jwtService.getUserType() === 'visitor'
  }
}
