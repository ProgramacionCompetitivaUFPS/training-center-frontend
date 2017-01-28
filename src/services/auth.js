import { Http } from 'services/http'
import { CONFIG } from 'config/config'
import { Router } from 'aurelia-router'
import { Jwt } from 'services/jwt'

export class Auth extends Http {

  static inject () {
    return [Router, Jwt]
  }

  constructor (router, jwtService) {
    super()
    this.router = router
    this.jwtService = jwtService
  }
  auth (user) {
    this.httpClient
      .fetch(CONFIG.endponts.auth, {
        method: 'post',
        body: user
      })
      .then((response) => response.json())
      .then((authorization) => {
        this.jwtService.save(authorization.token)
        this.router.navigate('')
      })
  }

  logout () {
    window.localStorage[CONFIG.tokenName] = null
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
