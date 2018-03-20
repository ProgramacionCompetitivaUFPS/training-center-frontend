import { inject } from 'aurelia-framework'

import { API } from 'config/config'
import { Contest } from 'models/models'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Rankings (Service)
 * Servicio encargado de la obtención del ranking
 * @export
 * @class Rankingss
 */

// dependencias a inyectar: Servicio de conexión Http (Http),
// servicio de manejo de Json Web Tokens (Jwt)
@inject(Http, Jwt)
export class Rankings {

  /**
   * Crea una instancia de Contests.
   * @param {service} httpService - Servicio de conexión Http (Http)
   * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
   */
  constructor (httpService, jwtService) {
    this.jwtService = jwtService
    this.httpService = httpService
  }
  /**
   * Obtiene del backend el ranking.
   */
  getRanking (limit, page) {
    return this.httpService.httpClient
      .fetch(API.endpoints.users + '/' + API.endpoints.ranking + '?limit=' + limit + '&page=' + page, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }
}