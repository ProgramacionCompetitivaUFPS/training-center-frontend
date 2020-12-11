import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Alert, Auth, Problems } from 'services/services'

/**
 * GeneralProblems (Module)
 * Módulo encargado de la vista principal de los materiales por categoría
 * @export
 * @class GeneralMaterials
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth) y Servicio de obtención y manejo de problemas (Problems)
// servicio de Router (Router)
@inject(Alert, Auth, Problems, Router)
export class GeneralMaterials {


    /**
     * Crea una instancia de GeneralProblems.
     * @param {service} alertService - Servicio de notificaciones
     * @param {service} authService - Servicio de autenticación
     * @param {service} problemService - Servicio de obtención y manejo de problemas
     * @param {service} routerService - Servicio de enrutamiento
     */
    constructor(alertService, authService, problemsService, routerService) {
        this.alertService = alertService
        this.authService = authService
        this.problemsService = problemsService
        this.routerService = routerService

    }

    /**
     * Método que toma los parametros enviados en el link y configura la página para adaptarse
     * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
     * ejecuta automáticamente luego de lanzar el constructor.
     * @param {any} params
     * @param {any} routeConfig
     */
    activate(params, routeConfig) {
        this.routeConfig = routeConfig
        this.label = routeConfig.route

    }


}