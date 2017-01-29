/**
 * Modelo que define los usuarios que utilizan la aplicación
 * @class User
 */
export class UserReset {
  /**
   * Crea una instancia del tipo usuario, al iniciar sesión o registrarse.
   * @param {string} [email=null]
   * @param {string} [password=null]
   * @param {string} [confirmPassword=null]
   */
  constructor (email = null, password = null, confirmPassword = null, token) {
    this.email = email
    this.password = password
    this.confirmPassword = confirmPassword
    this.token = token
  }
}
