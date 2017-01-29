/**
 * UserLogin
 * Modelo de usuario para el inicio de sesión
 * @export
 * @class UserLogIn
 */
export class UserLogIn {
  /**
   * Crea una instancia de UserLogIn.
   * @param {string} [email=null] - Email del usuario que inicia sesión
   * @param {string} [password=null] - Contraseña del usuario que inicia sesión
   */
  constructor (email = null, password = null) {
    this.email = email
    this.password = password
  }
}
