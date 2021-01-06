import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Alert, Auth, Problems } from 'services/services'

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
        this.newCategory = ''
        this.categoryEditId = null
        this.categoryEditName = ''
        this.categoryRemoveId = null
        this.categoryRemoveName = ''
        this.typeCategory = 2
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
     * Crea una nueva categoría a nivel de colegios en la plataforma
     */
    createCategory() {
        this.problemsService.createCategory(this.newCategory)
            .then(() => {
                this.getCategories()
                this.alertService.showMessage(MESSAGES.categoryCreated)
                window.$('#new-category').modal('hide')
            })
            .catch(() => {
                this.alertService.showMessage(MESSAGES.unknownError)
                window.$('#new-category').modal('hide')
            })
    }

    /**
     * Lee la lista de categorías a nivel de colegios, disponibles en la plataforma.
     */
    getCategories() {
        this.problemsService.getCategories(this.typeCategory)
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

    /**
     * Muestra en pantalla el popup para editar el nombre de una categoría.
     * @param {number} id - Identificador de la categoría a editar.
     * @param {string} name - Nombre actual de la categoría.
     */
    showEditCategory(id, name) {
        this.categoryEditId = id
        this.categoryEditName = name
        window.$('#edit-category').modal('show')
    }

    /**
     * Muestra en pantalla el popup para eliminar una categoría.
     * @param {number} id - Identificador de la categoría a eliminar.
     * @param {string} name - Nombre de la categoría.
     */
    showRemoveCategory(id, name) {
        this.categoryRemoveId = id
        this.categoryRemoveName = name
        window.$('#remove-category').modal('show')
    }

    /**
     * Envia al servidor el nuevo nombre de una categoría para ser editado.
     */
    editCategory() {
        this.problemsService.editCategory(this.categoryEditId, this.categoryEditName)
            .then(() => {
                this.categories.find(i => i.id === this.categoryEditId).name = this.categoryEditName
                this.alertService.showMessage(MESSAGES.categoryEdited)
                window.$('#edit-category').modal('hide')
            })
            .catch(error => {
                if (error.status === 401 || error.status === 403) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else if (error.status === 500) {
                    this.alertService.showMessage(MESSAGES.serverError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
                window.$('#edit-category').modal('hide')
            })
    }

    /**
     * Envia al servidor la categoría que debe ser eliminada.
     */
    removeCategory() {
        this.problemsService.removeCategory(this.categoryRemoveId)
            .then(() => {
                this.categories.splice(this.categories.findIndex(i => i.id === this.categoryRemoveId), 1)
                this.alertService.showMessage(MESSAGES.categoryRemoved)
                window.$('#remove-category').modal('hide')
            })
            .catch(error => {
                if (error.status === 401 || error.status === 403) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else if (error.status === 500) {
                    this.alertService.showMessage(MESSAGES.serverError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
                window.$('#remove-category').modal('hide')
            })
    }
}