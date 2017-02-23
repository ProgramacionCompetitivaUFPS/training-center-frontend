import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Category } from 'models/models'
import { Alert, Problems } from 'services/services'

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
    return [Alert, Problems, Router]
  }

  /**
   * Crea una instancia de CategoryProblems.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio manejador de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, problemService, routerService) {
    this.alertService = alertService
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
    this.problemsService.getCategoryProblems(this.id, this.page, this.noProblemsToShow, this.sort, this.by)
      .then(data => {
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
}
