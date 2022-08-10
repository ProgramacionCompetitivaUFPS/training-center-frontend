import { inject } from 'aurelia-framework'
import { API } from 'config/config'
import { Alert } from 'services/alert'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

import io from 'socket.io-client'
/**
 * Auth (Service)
 * Servicio de autenticación y registro
 * @export
 * @class Auth
 */
@inject(Http, Alert, Jwt)
export class Auth {

    /**
     * Crea una instancia de Auth.
     * @param {service} httpService - Servicio para conexiones http
     * @param {service} jwtService - Servicio para manejo de Json Web Tokens (jwt)
     */
    constructor(httpService, alertService, jwtService) {
            this.httpService = httpService
            this.alertService = alertService
            this.jwtService = jwtService
            this.authenticated = this.isAuthenticated()
            this.socketActive = false
            this.activateSocket()
        }
        /**
         * Envia al servidor los datos de inicio de sesión, y retorna el token de usuario si el login
         * es válido.
         * @param {UserLogIn} user - Usuario del tipo userLogin con email y password
         * @returns - Promise con el token de usuario
         */
    auth(user) {
        return this.httpService.httpClient
            .fetch(API.endpoints.auth, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    activateSocket() {
        if (this.authenticated && !this.socketActive) {
            this.socket = io.connect(API.apiUrl + 'normal-mode')
            this.socket.emit('register', this.getUserId())
            this.socket.on('new result', (data) => {
                if (data.verdict === 'Accepted') {
                    this.alertService.showMessage({
                        text: 'Tu solución al problema ' + data.problem_id + ' "' + data.problem_name + '" es correcta. ¡Muy bien!',
                        type: 'success'
                    })
                } else if (data.verdict === 'Compilation Error') {
                    this.alertService.showMessage({
                        text: 'Tu solución al problema ' + data.problem_id + ' "' + data.problem_name + '" presenta un error de compilación.',
                        type: 'error'
                    })
                } else if (data.verdict === 'Time Limit Exceeded') {
                    this.alertService.showMessage({
                        text: 'Tu solución al problema ' + data.problem_id + ' "' + data.problem_name + '" excede el tiempo límite permitido.',
                        type: 'error'
                    })
                } else if (data.verdict === 'Runtime Error') {
                    this.alertService.showMessage({
                        text: 'Tu solución al problema ' + data.problem_id + ' "' + data.problem_name + '" tiene un error en tiempo de ejecución.',
                        type: 'error'
                    })
                } else if (data.verdict === 'Wrong Answer') {
                    this.alertService.showMessage({
                        text: 'Tu solución al problema ' + data.problem_id + ' "' + data.problem_name + '" imprime una respuesta erronea.',
                        type: 'error'
                    })
                }
            })
            this.socketActive = true
        }
    }

    /**
     * Envia un estudiante para ser registrado en la plataforma
     * @param {UserSignIn} user - Datos del usuario a ser registrado en la plataforma
     * @returns Promise sin body, donde el status code indica el resultado de la operación
     */
    registerStudent(user) {
        let body = {
            name: user.name,
            code: user.code,
            email: user.email,
            password: user.password,
            confirm_password: user.confirmPassword,
            username: user.username
        }
        return this.httpService.httpClient
            .fetch(API.endpoints.users, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Envia un usuario administrador o docente para ser registrado en la plataforma
     * @param {UserSignIn} user - Datos del usuario a ser registrado en la plataforma
     * @returns Promise sin body, donde el status code indica el resultado de la operación
     */
    createSuperUser(user) {
        let body = {
            name: user.name,
            code: user.code,
            email: user.email,
            password: user.password,
            confirm_password: user.confirmPassword,
            username: user.username,
            type: user.type
        }
        return this.httpService.httpClient
            .fetch(API.endpoints.superUser, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.jwtService.token
                },
                body: JSON.stringify(body)
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Envia un correo para solicitar un cambio de contraseña. Si el correo está registrado
     * Se enviará un mensaje a esa dirección para proceder con el cambio.
     * @param {string} email - Correo que solicita el cambio
     * @returns Promise sin body, donde el status code indica el resultado de la operación
     */
    requestRecovery(email) {
        return this.httpService.httpClient
            .fetch(API.endpoints.recovery + '?email=' + email, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Verifica que el token de cambio de contraseña es valido.
     * @param {string} token - token enviado por email
     * @returns Promise con cuerpo {email: email} en caso de ser exitoso.
     */
    validateReset(token) {
        return this.httpService.httpClient
            .fetch(API.endpoints.reset, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    setPassword(id, oldPassword, newPassword, retypePassword) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + id + '/update-password', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    password: newPassword,
                    confirm_password: retypePassword
                })
            })
            .then(this.httpService.checkStatus)
    }

    editProfile(id, email, username, name, code, institution) {
        console.log(JSON.stringify({
            email: email,
            username: username,
            name: name,
            code: code,
            institution: institution
        }));

        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    name: name,
                    code: code,
                    institution: institution
                })
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Envía los datos de un usuario para reestablecer su contraseña
     * @param {userReset} user - Usuario cuya contraseña será reestablecida
     * @returns Promise sin body, donde el status code indica el resultado de la operación
     */
    resetPassword(user) {
        return this.httpService.httpClient
            .fetch(API.endpoints.reset, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Inicia sesión guardando el token en el almacenamiento local del usuario.
     * @param {string} token - Token para almacenar
     */
    login(token) {
        this.jwtService.save(token)
        this.authenticated = this.isAuthenticated()
        this.activateSocket()
    }

    /**
     * Cierra una sesión de usuario en la plataforma.
     */
    logout() {
        this.jwtService.remove()
        this.authenticated = this.isAuthenticated()
        this.socketActive = false
    }

    /**
     * Informa si el usuario se encuentra actualmente autenticado (tiene una sesión activa)
     * @returns boolean - true si está autenticado, false en caso contrario
     */
    isAuthenticated() {
        return this.jwtService.tokenExists()
    }

    /**
     * Informa si el usuario es un estudiante.
     * @returns boolean - true si es estudiante, false en caso contrario
     */
    isStudent() {
        if (this.jwtService.getUserType() === 'student' && !this.socketActive) this.activateSocket()
        return this.jwtService.getUserType() === 'student'
    }

    /**
     * Informa si el usuario es un coach.
     * @returns boolean - true si es coach, false en caso contrario
     */
    isCoach() {
        if (this.jwtService.getUserType() === 'coach' && !this.socketActive) this.activateSocket()
        return this.jwtService.getUserType() === 'coach'
    }

    /**
     * Informa si el usuario es un administrador.
     * @returns boolean - true si es administrador, false en caso contrario
     */
    isAdmin() {
        if (this.jwtService.getUserType() === 'admin' && !this.socketActive) this.activateSocket()
        return this.jwtService.getUserType() === 'admin'
    }

    /**
     * Informa si el usuario es un visitante (no autenticado).
     * @returns boolean - true si es visitante, false en caso contrario
     */
    isVisitor() {
        return this.jwtService.getUserType() === 'visitor'
    }

    /**
     * Recibe el token de recuperación de contraseña, verifica que sea valido
     * y retorna el email contenido en el token.
     * @param {string} token - token recibido
     * @returns {string}  email de usuario
     * @throws {error} invalid token - Token falso o erroneo
     * @throws {error} expired token - Token vencido
     */
    validateResetToken(token) {
        let info
        let startDate
        let endDate
        try {
            info = JSON.parse(window.atob(token.split('.')[1]))
            startDate = info.iat
            endDate = info.exp
        } catch (e) {
            info = null
        }
        if (info == null || startDate === undefined || endDate === undefined) {
            throw new Error('invalid token')
        }
        let actualDate = new Date().getTime() / 1000
        if (actualDate < startDate) {
            throw new Error('invalid token')
        } else if (actualDate + 1000 >= endDate) {
            throw new Error('expired token')
        } else {
            return info.email
        }
    }

    /**
     * Retorna el id del usuario actualmente logueado
     * @returns id del usuario logueado
     */
    getUserId() {
        return this.jwtService.getUserId()
    }

    getUserInstitution() {
        return this.jwtService.getUserInstitution()
    }

    /**
     * Obtiene del backend la lista de usuarios.
     * @param {Number} page - Página de materiales a obtener
     * @param {Number} limit - Cantidad de materiales a obtener
     * @param {string} sort - opcional, por defecto ordena por id, si sort es 'name' ordena por nombre
     * @param {string} by - asc o desc, ordenamiento ascendente o descendente
     * @returns {Promise} Promesa con los usuarios.
     */
    getUsers(page, limit, sort, by) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '?page=' + page + '&limit=' + limit + '&sort=' + sort + '&by=' + by, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Elimina un usuario.
     * @param {Number} id - Id del usuario a eliminar.
     */
    removeUser(id) {
            return this.httpService.httpClient
                .fetch(API.endpoints.users + '/remove-account', {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + this.jwtService.token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'users': [id]
                    })
                })
                .then(this.httpService.checkStatus)
        }
        /**
         * Obtiene del backend la lista de universidades.
         */

}