import { API } from 'config/config'

/**
 * Jwt (service)
 * Servicio para el manejo de tokens del tipo JSON Web Token (jwt)
 * @export
 * @class Jwt
 */
export class Jwt {
  /**
   * Crea una instancia de Jwt.
   */
  constructor () {
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
    return window.localStorage.getItem(API.tokenName) !== null
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

  /**
   * Obtiene el tipo de usuario almacenado en el token
   * @returns string - visitor, student, coach o admin según corresponda
   */
  getUserType () {
    if (!this.tokenExists()) {
      return 'visitor'
    } else {
      let type = this.data.usertype
      switch (type) {
        case '0':
          return 'student'
        case '1':
          return 'coach'
        case '2':
          return 'admin'
      }
      return 'visitor'
    }
  }

}
