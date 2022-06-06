import { inject } from 'aurelia-framework'
import { API } from 'config/config'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

@inject(Http, Jwt)
export class Date {
  /**
   * Crea una instancia de Material.
   * @param {service} httpService - Servicio de conexión Http (Http)
   * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
   */
  constructor (httpService, jwtService) {
    this.jwtService = jwtService
    this.httpService = httpService 
  }
  /**
   * Obtiene la fecha actual desde el servidor.
   */
  getServerDate() {
    return this.httpService.httpClient
    .fetch(API.endpoints.date, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.jwtService.token
      }
    })
    .then(this.httpService.checkStatus)
    .then(this.httpService.parseJSON)
  }

}