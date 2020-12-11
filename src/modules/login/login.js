import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserLogIn } from 'models/models'
import { Alert, Auth } from 'services/services'

/**
 * Login (Module)
 * Módulo de la aplicación para realizar el inicio de sesión
 * Accesible vía /iniciar-sesion/
 * @export
 * @class Login
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// servicio de autenticación (Auth) y servicio de enrutamiento (Router)
@inject(Alert, Auth, Router)
export class Login {

    /**
     * Crea una instancia de Login.
     * @param {service} alertService - Servicio de notificaciones en pantalla
     * @param {service} authorizationService - Servicio de autenticación y registro
     * @param {service} router - Servicio de enrutamiento
     */
    constructor(alertService, authorizationService, router) {
        this.authorizationService = authorizationService
        this.router = router
        this.alertService = alertService
        this.user = new UserLogIn()
    }

    /**
     * Valida los datos e intenta iniciar sesión
     */
    login() {
        if (this.user.email !== '' && this.user.password !== '' && this.user.email != null && this.user.password !== null) {
            this.authorizationService.auth(this.user)
                .then((data) => {
                    this.authorizationService.login(data.token)
                    this.router.navigate('')
                }) // Si el inicio es valido, guarda el token y redirige al inicio
                .catch(error => {
                    switch (error.status) {
                        case 401:
                            this.alertService.showMessage(MESSAGES.loginWrongData)
                            this.user = new UserLogIn()
                            break
                        case 500:
                            this.alertService.showMessage(MESSAGES.serverError)
                            break
                        default:
                            this.alertService.showMessage(MESSAGES.unknownError)
                    }
                })
        } else {
            this.alertService.showMessage(MESSAGES.loginIncompleteData)
        }
    }
}