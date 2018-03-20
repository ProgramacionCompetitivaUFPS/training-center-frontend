import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Alert, Rankings } from 'services/services'

@inject(Alert, Rankings)
export class Ranking {
  // Elementos observables. 
  @observable page

  /**
   * Inicializa el ranking
   */
  constructor (alertService, rankingService) {
    this.alertService = alertService
    this.rankingService = rankingService
    this.page = 1
    this.totalPages = 1
    this.users = []
    this.getRanking()
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if (prev !== undefined) this.getRanking()
  }

  getRanking() {
    this.rankingService.getRanking(30, this.page)
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
