import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import introJs from 'intro.js'
import { Alert, Auth, Problems } from 'services/services'
import { Enums } from 'models/models'

/**
 * GeneralProblemsHighSchool(Module)
 *  Módulo encargado de la vista principal de las categorías, maratones y problemas, a nivel de colegios
 * @export
 * @class GeneralProblemsHighSchool
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth) y Servicio de obtención y manejo de problemas (Problems)
// servicio de Router (Router)
@inject(Alert, Auth, Problems, Router)
export class GeneralProblemsHighSchool {

    /**
     * Crea una instancia de GeneralProblemsHighSchool.
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
        this.categories = []

        this.enums = Enums
    
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
    }

    /**
     * Inicializa la lista de categorías para desplegarlas en la vista.
     * Este método se dispara una vez la vista y el view-model son cargados.
     */
    created() {
        this.getCategories()
    }

    /**
     * Lee la lista de categorías a nivel de colegios, disponibles en la plataforma.
     */
    getCategories() {
        this.problemsService.getCategories(this.enums.typeCategory.school)
            .then(data => {
                this.categories = data.categories
                if (this.categories.length === 0) {
                    this.alertService.showMessage(MESSAGES.categoriesEmpty)
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
            })
    }


    tour(){
        introJs().start();
        introJs().addHints();
    }
}