import { inject } from 'aurelia-framework'
import { API, MESSAGES } from 'config/config'
import { Alert } from 'services/alert'

/**
 * Jwt (service)
 * Servicio para el manejo de tokens del tipo JSON Web Token (jwt)
 * @export
 * @class Jwt
 */
@inject(Alert)
export class Jwt {
  /**
   * Crea una instancia de Jwt.
   */
  constructor (alertService) {
    this.alertService = alertService
    this.token = window.localStorage.getItem(API.tokenName)
    if (this.tokenExists()) {
      this.data = JSON.parse(window.atob(this.token.split('.')[1]))
    } else {
      this.data = null
    }
  }

  /**
   * Guarda un nuevo token en el almacenamiento local del usuario.
   * @param {string} token - Token a almacenar
   */
  save (token) {
    window.localStorage.setItem(API.tokenName, token)
    this.token = window.localStorage.getItem(API.tokenName)
    this.data = JSON.parse(window.atob(this.token.split('.')[1]))
  }

  /**
   * Elimina un token del almacenamiento local del usuario.
   */
  remove () {
    window.localStorage.removeItem(API.tokenName)
    this.token = null
    this.data = null
  }

  /**
   * Verifica si existe un token almacenado.
   * @returns boolean - true si existe un token, false en caso contrario
   */
  tokenExists () {
    if (window.localStorage.getItem(API.tokenName) === null) return false
    let tmp = JSON.parse(window.atob(this.token.split('.')[1])).exp
    let now = Date.parse(new Date()) / 1000
    if (tmp > now) return true
    else {
      this.remove()
      this.alertService.showMessage(MESSAGES.sessionExpired)
      return false
    }
  }

  /**
   * Obtiene el nombre de usuario almacenado en el token
   * @returns string - nombre de usuario
   */
  getUsername () {
    if (!this.tokenExists) {
      return null
    } else {
      return this.data.username
    }
  }

  /**
   * Obtiene el id de usuario almacenado en el token
   * @returns number - Id del usuario
   */
  getUserId () {
    if (!this.tokenExists) {
      return null
    } else {
      return this.data.sub
    }
  }

  getUserInstitution() {
    if (!this.tokenExists) {
      return null
    } else {
      return this.data.institution
    }
  }

  /**
   * Obtiene el tipo de usuario almacenado en el token
   * @returns string - visitor, student, coach o admin según corresponda
   */
  getUserType () {
    if (!this.tokenExists()) {
      return 'visitor'
    } else {
      let type = parseInt(this.data.usertype)
      switch (type) {
        case 0:
          return 'student'
        case 1:
          return 'coach'
        case 2:
          return 'admin'
      }
      return 'visitor'
    }
  }
}
