import { API } from 'config/config'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Problems (Service)
 * Servicio encargado del manejo de problemas y categorías
 * @export
 * @class Materials
 */
export class Materials {
  /**
   * Método que realiza inyección de las dependencias necesarias en el servicio.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de conexión Http (Http),
   * servicio de manejo de Json Web Tokens (Jwt)
   */
  static inject () {
    return [Http, Jwt]
  }

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
   * Obtiene del backend la lista de materiales para una categoría dada.
   * @param {Number} idCategory - Id de la categoria
   * @returns {Promise} Promesa con el token de usuario
   */
  getCategoryMaterial (idCategory) {
    return this.httpService.httpClient
      .fetch(API.endpoints.categories + '/' + idCategory + '/' + API.endpoints.materials, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene del backend los atributos de un material específico dado.
   * @param {Number} idMaterial - Id del material
   * @returns {Promise} Promesa con el token de usuario
   */
  getMaterial (idMaterial) {
    return this.httpService.httpClient
      .fetch(API.endpoints.materials + '/' + idMaterial, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }
}
