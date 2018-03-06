import { inject } from 'aurelia-framework'

import { API } from 'config/config'
import { Contest } from 'models/models'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Contests (Service)
 * Servicio encargado del manejo de maratones de programación
 * @export
 * @class Contests
 */

// dependencias a inyectar: Servicio de conexión Http (Http),
// servicio de manejo de Json Web Tokens (Jwt)
@inject(Http, Jwt)
export class Contests {

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
   * Crea una nueva maratón en el sistema
   * @param {Contest} contest - Maratón a crear
   */
  createContest (contest) {
    let key = undefined
    if (!contest.public) key = contest.key 
    return this.httpService.httpClient
      .fetch(API.endpoints.contests, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: contest.title,
          description: contest.description,
          init_date: contest.initDate,
          end_date: contest.endDate,
          rules: contest.rules, 
          public: contest.privacy, 
          key: key
        })
      })
      .then(this.httpService.checkStatus)
  }
}
