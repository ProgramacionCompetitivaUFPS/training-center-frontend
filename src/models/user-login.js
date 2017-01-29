/**
 * Modelo que define los usuarios que utilizan la aplicación
 * @class User
 */
export class UserLogIn {
  /**
   * Crea una instancia del tipo usuario, al iniciar sesión o registrarse.
   * @param {string} [email=null]
   * @param {string} [password=null]
   */
  constructor (email = null, password) {
    this.email = email
    this.password = password
  }
}
