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
export class CategoryProblems {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de problemas (Problems), servicio de Router (Routr)
   */
  static inject () {
    return [Alert, Auth, Problems, Router]
  }

  /**
   * Crea una instancia de CategoryProblems.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {service} problemService - Servicio manejador de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, problemService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.problemsService = problemService
    this.routerService = routerService
    this.totalPages = 0
    this.noProblemsToShow = 10
    this.page = 1
    this.sort = 'id'
    this.sortDisplay = 'Id'
    this.by = 'asc'
    this.byDisplay = 'Ascendente'
    this.pagination = []
    this.language = null
    this.languageDisplay = 'Cualquier idioma'
    this.problemToRemove = null
  }

  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate (params, routeConfig) {
    this.routeConfig = routeConfig
    this.id = params.id
    this.getProblems()
  }

  /**
   * Cambia el número de problemas a mostrar por pantalla.
   * @param {number} [noProblemsToShow] - Nuevo número de problemas a mostrar
   */
  setNoProblemsToShow (noProblemsToShow) {
    this.noProblemsToShow = noProblemsToShow
    this.getProblems()
  }

  /**
   * Establece el criterio de ordenamiento y solicita la lista de problemas según el nuevo ordenamiento.
   * @param {string} sort - Ordenamiento (id, name o level)
   * @param {string} sortDisplay - Texto para desplegar por el ordenamiento elegido
   */
  setSort (sort, sortDisplay) {
    this.sort = sort
    this.sortDisplay = sortDisplay
    this.getProblems()
  }

  /**
   * Establece el filtro para seleccionar ejercicios en cualquier idioma, o en uno determinado.
   * @param {string} language - Lenguaje (es, en o null)
   * @param {string} languageDisplay - Texto para desplegar por el lenguaje elegido
   */
  setLanguage (language, languageDisplay) {
    this.language = language
    this.languageDisplay = languageDisplay
    this.getProblems()
  }

  /**
   * Establece el tipo de ordenamiento y solicita la lista de problemas según el nuevo ordenamiento.
   * @param {string} by - Ordenamiento (asc o desc)
   * @param {string} byDisplay - Texto para desplegar por el tipo elegido
   */
  setBy (by, byDisplay) {
    this.by = by
    this.byDisplay = byDisplay
    this.getProblems()
  }

  /**
   * Establece la paginación de los problemas en la parte inferior.
   */
  setPagination () {
    this.pagination = []
    if (this.page === this.totalPages && this.page - 4 > 0) {
      this.pagination.push(this.page - 4)
      this.pagination.push(this.page - 3)
    } else if (this.page + 1 === this.totalPages && this.page - 3 > 0) {
      this.pagination.push(this.page - 3)
    }
    if (this.page > 2) {
      this.pagination.push(this.page - 2)
    }
    if (this.page > 1) {
      this.pagination.push(this.page - 1)
    }
    this.pagination.push(this.page)
    while (this.pagination.length < 5 && this.pagination[this.pagination.length - 1] < this.totalPages) {
      this.pagination.push(this.pagination[this.pagination.length - 1] + 1)
    }
  }

  /**
   * Obtiene la lista de problemas según los parametros indicados.
   */
  getProblems () {
    this.problemsService.getCategoryProblems(this.id, this.page, this.noProblemsToShow, this.sort, this.by, this.language)
      .then(data => {
        console.log(data)
        this.category = new Category(data.meta.categoryName)
        this.category.setTotalProblems(data.meta.totalItems)
        this.category.setProblemsLoaded(data.data)
        this.totalPages = data.meta.totalPages
        this.setPagination()
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.categoryDoesNotExist)
          this.routerService.navigate('')
        }
      })
  }

  /**
   * Muestra la primera página de ejercicios en una categoría
   */
  goToFirstPage () {
    this.goToPage(1)
  }

  /**
   * Muestra la última página de ejercicios en una categoría.
   */
  goToLastPage () {
    this.goToPage(this.totalPages)
  }

  /**
   * Muestra la página anterior a la actual de ejercicios en una categoría.
   */
  goToPrevPage () {
    if (this.page > 1) {
      this.goToPage(this.page - 1)
    }
  }

  /**
   * Muestra la página de ejercicios siguiente a la actual en una categoría.
   */
  goToNextPage () {
    if (this.page < this.totalPages) {
      this.goToPage(this.page + 1)
    }
  }

  /**
   * Muestra una página especifica de ejercicios en una categoría.
   * @param {any} page - Página a mostrar
   */
  goToPage (page) {
    if (page !== this.page) {
      this.page = page
      this.getProblems()
    }
  }

  /**
   * Muestra un popup para confirmar la eliminación del problema indicado por id.
   * @param {number} id - Identificador del problema a eliminar.
   */
  showRemoveProblem (id) {
    this.problemToRemove = id
    window.$('#remove-problem').modal('show')
  }

  /**
   * Elimina un problema de la plataforma.
   */
  removeProblem () {
    this.problemService.removeProblem(this.problemToRemove)
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
