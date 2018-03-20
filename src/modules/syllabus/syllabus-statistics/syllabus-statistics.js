import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Alert, Syllabuses} from 'services/services'

@inject(Alert, Syllabuses)
export class SyllabusStatistics {
  // Elementos observables. 
  @observable page

  /**
   * Inicializa el ranking
   */
  constructor (alertService, syllabusService) {
    this.alertService = alertService
    this.syllabusService = syllabusService
    this.page = 1
    this.totalPages = 1
    this.users = []
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if (prev !== undefined) this.getStatistics()
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
    this.getStatistics()
  }

  getStatistics() {
    this.syllabusService.getStatistics(this.id, 30, this.page)
      .then(data => {
        this.totalPages = data.meta.totalPages
        this.users = data.data
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.unknownError)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
      })
  }
}
