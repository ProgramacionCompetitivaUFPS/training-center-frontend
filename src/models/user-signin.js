/**
 * Modelo que define los usuarios que utilizan la aplicación
 * @class User
 */
export class UserSignIn {
  /**
   * Crea una instancia del tipo usuario, al iniciar sesión o registrarse.
   * @param {string} [email=null]
   * @param {string} [password=null]
   * @param {string} [confirmPassword=null]
   * @param {string} [name=null]
   * @param {string} [username=null]
   * @param {number} [code=null]
   */
  constructor (email = null, password = null, confirmPassword = null, name = null, username = null, code = null, type = null) {
    this.email = email
    this.password = password
    this.confirmPassword = confirmPassword
    this.name = name
    this.username = username
    this.code = code
    this.type = type
  }
}
