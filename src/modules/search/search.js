import { inject, observable } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Problem } from 'models/models'
import { Alert, Problems } from 'services/services'

@inject(Alert, Router, Problems)
export class Search {
  // Elementos observables. 
  @observable page
  @observable filterChange

  constructor (alertService, routerService, problemService) {
    this.alertService = alertService
    this.routerService = routerService
    this.problemService = problemService
    this.totalPages = 1
    this.page = 1
    this.numberOfItems = [10, 20, 30, 50]
    this.sortOptions = ['Id', 'Nombre', 'Dificultad']
    this.filterChange = false
    this.limit = 10
    this.sort = 'Id'
    this.by = 'Ascendente'
    this.language = 'Cualquier idioma'
    this.pagination = []
    this.problems = []
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
    this.query = params.query.replace(/\+/g, ' ')
    this.getQuery()
  }

  /**
   * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
  filterChangeChanged (act, prev) {
    if(prev !== undefined) this.getQuery()
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if(prev !== undefined) this.getQuery()
  }

  getQuery () {
    let stringLang
    if (this.language === 'Español') stringLang = 'es'
    else if (this.language === 'Inglés') stringLang = 'en'
    else stringLang = undefined
    this.problemService.searchProblems(this.query, this.page, this.limit, (this.sort === 'Nombre') ? 'name' : undefined, (this.by === 'Ascendente' ? 'asc' : 'desc'), stringLang)
    .then(data => {
      this.totalPages = data.meta.totalPages
      this.problems = []
      if (this.totalPages > 0) {
        for(let i = 0; i < data.data.length; i++) {
          this.problems.push(new Problem(data.data[i].id, data.data[i].title_en, data.data[i].title_es, data.data[i].level))
        }
      }
    }).catch(error => {
      console.log(error)
      if (error.status === 401) {
        this.alertService.showMessage(MESSAGES.permissionsError)
      } else {
        this.alertService.showMessage(MESSAGES.unknownError)
      }
    })
  }
}