
/**
 * UserReset
 * Modelo de usuario para el cambio de contraseña
 * @export
 * @class UserReset
 */
export class UserReset {

  /**
   * Crea una instancia de UserReset.
   * @param {string} [email=null] - Email del usuario que solicita el cambio de contraseña
   * @param {string} [password=null] - Nueva contraseña
   * @param {string} [confirmPassword=null] - Verificación de la nueva contraseña
   * @param {string} [token=null] - Token para validar que el usuario realmente ha solicitado el cambio.
   */
  constructor (email = null, password = null, confirmPassword = null, token = null) {
    this.email = email
    this.password = password
    this.confirmPassword = confirmPassword
    this.token = token
  }
}
