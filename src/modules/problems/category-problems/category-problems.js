import { inject, observable } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Category } from 'models/models'
import { Alert, Auth, Problems } from 'services/services'

/**
 * CategoryProblems (Module)
 * Módulo encargado de mostrar los problemas que hacen parte de una categoría
 * @export
 * @class CategoryProblems
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de autenticación (Auth), Servicio de problemas (Problems), 
// servicio de Router (Router)
@inject(Alert, Auth, Problems, Router)
export class CategoryProblems {
    // Elementos observables. 
    @observable page
    @observable filterChange

    /**
     * Crea una instancia de CategoryProblems.
     * @param {service} alertService - Servicio de notificaciones
     * @param {service} authService - Servicio de autenticación y validación
     * @param {service} problemService - Servicio manejador de problemas
     * @param {service} routerService - Servicio de enrutamiento
     */
    constructor(alertService, authService, problemService, routerService) {
        this.alertService = alertService
        this.authService = authService
        this.problemsService = problemService
        this.routerService = routerService
        this.totalPages = 1
        this.page = 1
        this.numberOfItems = [10, 20, 30, 50]
        this.dummyTotals = [0, 0, 4, 12,47]
        this.dummyPercentage = [0, 0, 50, 75,23]
        this.sortOptions = ['Id', 'Nombre', 'Aprobados','Envios']
        this.filterChange = false
        this.limit = 10
        this.sort = 'Id'
        this.by = 'Ascendente'
        this.pagination = []
        this.language = 'Cualquier idioma'
        this.problemToRemove = null
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
        this.id = params.id
        this.getProblems()
    }

    /**
     * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
     * @param {bool} act - Nuevo estado 
     * @param {bool} prev - Antiguo estado
     */
    filterChangeChanged(act, prev) {
        if (prev !== undefined) this.getProblems()
    }

    /**
     * Detecta cuando el número de página es modificado para solicitar el nuevo número.
     * @param {Number} act - Número de página nuevo.
     * @param {Number} prev - Número de página antes del cambio
     */
    pageChanged(act, prev) {
        if (prev !== undefined) this.getProblems()
    }

    /**
     * Obtiene la lista de problemas según los parametros indicados.
     */
    getProblems() {
        let stringSort, stringLang
        if (this.sort === 'Id') stringSort = null
        else if (this.sort === 'Nombre') stringSort = 'name'
        else if (this.sort === 'Aprobados') stringSort = 'approval_rate'
        else if (this.sort === 'Envios') stringSort = 'submissions'
        if (this.language === 'Español') stringLang = 'es'
        else if (this.language === 'Inglés') stringLang = 'en'
        else stringLang = null
        this.problemsService.getCategoryProblems(this.id, this.page, this.limit, stringSort, (this.by === 'Ascendente' ? 'asc' : 'desc'), stringLang)
            .then(data => {
                this.category = new Category(data.meta.categoryName)
                this.category.setTotalProblems(data.meta.totalItems)
                this.totalPages = data.meta.totalPages
                if (this.totalPages !== 0) {
                    this.category.setProblemsLoaded(data.data)
                } else {
                    this.alertService.showMessage(MESSAGES.problemsEmpty)
                }
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.categoryDoesNotExist)
                    this.routerService.navigate('')
                }
            })
    }

    /**
     * Descarga el archivo de inputs o outpus¿ts
     */

    download(problem, type) {
        let fileFolder, filePath, extension, fileName = problem.titleES == null? problem.titleEN : problem.titleES
        if (type == 0) {
            fileName += ' – input';
            filePath = problem.input.split('/')[6];
            fileFolder = 'inputs';
            extension = '.in'
        } else {
            fileName += ' – output';
            filePath = problem.output.split('/')[6];
            fileFolder = 'outputs';
            extension = '.out'
        }
        this.problemsService.getDataFile(problem.id, fileFolder, filePath).then(data => {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var txtBlob = new Blob([event.target.result], {
                    type: 'text/plain'
                });

                var link = document.createElement('a');
                link.href = URL.createObjectURL(txtBlob);
                link.download = fileName + extension;

                link.click();
                URL.revokeObjectURL(link.href);
                link.remove();
            };
            fileReader.readAsText(data);
        })
    }
    
    /**
     * Redondea un numero a dos cifras
     * @param {number} number - numero
     */
    roundToTwoDecimals(number) {
        if (number ==null){return 0}
        number = parseFloat(number);
        if (Number.isInteger(number)) {
            return number;
        } else {
            return number.toFixed(2);
        }
      }

    /**
     * Muestra un popup para confirmar la eliminación del problema indicado por id.
     * @param {number} id - Identificador del problema a eliminar.
     */
    showRemoveProblem(id) {
        this.problemToRemove = id
        window.$('#remove-problem').modal('show')
    }

    /**
     * Elimina un problema de la plataforma.
     */
    removeProblem() {
        this.problemsService.removeProblem(this.problemToRemove)
            .then(() => {
                this.alertService.showMessage(MESSAGES.problemDeleted)
                this.category.removeProblem(this.problemToRemove)
                window.$('#remove-problem').modal('hide')
            })
            .catch(error => {
                if (error.status === 401 || error.status === 403) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else if (error.status === 500) {
                    this.alertService.showMessage(MESSAGES.serverError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
                window.$('#remove-problem').modal('hide')
            })
    }
}