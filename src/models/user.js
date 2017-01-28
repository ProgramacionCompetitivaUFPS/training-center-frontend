/**
 * Modelo que define los usuarios que utilizan la aplicación
 * @class User
 */
export class User {
  /**
   * Crea una instancia del tipo usuario, al iniciar sesión o registrarse.
   * @param {string} [email=null]
   * @param {string} [password=null]
   * @param {string} [repassword=null]
   * @param {string} [name=null]
   * @param {string} [username=null]
   * @param {number} [code=null]
   */
  constructor (email = null, password = null, repassword = null, name = null, username = null, code = null) {
    this.email = email
    this.password = password
    this.repassword = repassword
    this.name = name
    this.username = username
    this.code = code
  }
}
