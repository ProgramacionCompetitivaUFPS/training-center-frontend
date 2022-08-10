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
     * @param {number} [id=null] - Identificador del usuario
     */
    constructor(email = null, password = null, confirmPassword = null, name = null, username = null, code = null, type = null, id = null, institution = null) {
        this.email = email
        this.password = password
        this.confirmPassword = confirmPassword
        this.name = name
        this.username = username
        this.code = code
        this.type = type
        this.id = id
        this.institution = institution
    }

    /**
     * Valida que el usuario sea valido (solo el código puede ser nulo)
     * @return {boolean} true si el usuario es valido, falso si no
     */
    isValid() {
        if (this.email === '' || this.email == null) {
            return false
        }
        if (this.password === '' || this.password == null) {
            return false
        }
        if (this.confirmPassword === '' || this.confirmPassword == null) {
            return false
        }
        if (this.name === '' || this.name == null) {
            return false
        }
        if (this.username === '' || this.username == null) {
            return false
        }
        if (this.type === '' || this.type == null) {
            return false
        }
        return true
    }
}
