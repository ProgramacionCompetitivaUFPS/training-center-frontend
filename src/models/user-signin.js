
/**
 * UserSignIn
 * Modelo de usuario para el registro en la aplicación
 * @export
 * @class UserSignIn
 */
export class UserSignIn {
  /**
   * Crea una instancia del tipo usuario, al registrarse.
   * @param {string} [email=null] - Correo electrónico del nuevo usuario
   * @param {string} [password=null] - Contraseña del nuevo usuario
   * @param {string} [confirmPassword=null] - Verificación de contraseña
   * @param {string} [name=null] - Nombre del usuario
   * @param {string} [username=null] - Username del usuario
   * @param {number} [code=null] - Código del usuario
   * @param {number} [type=null] - Tipo de usuario (0 => estudiante, 1=> coach, 2=> admin)
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
