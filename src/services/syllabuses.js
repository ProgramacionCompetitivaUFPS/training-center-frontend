import { API } from 'config/config'
import { Syllabus } from 'models/models'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Syllabuses (Service)
 * Servicio encargado del manejo de clases
 * @export
 * @class Syllabuses
 */
export class Syllabuses {
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
   * Crea una instancia de Syllabus.
   * @param {service} httpService - Servicio de conexión Http (Http)
   * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
   */
  constructor (httpService, jwtService) {
    this.jwtService = jwtService
    this.httpService = httpService
  }

  /**
   * Obtiene del backend la lista de syllabus existentes.
   * @param {number} limit - cantidad de syllabuses a obtener
   * @param {number} page - página actual
   * @param {number} coach - opcional. Id del coach
   * @returns {Promise} Promesa con el token de usuario
   */
  getSyllabuses (limit, page, coach) {
    let data = '?limit=' + limit + '&page=' + page
    if (coach !== null) data += '&coach=' + coach
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus + data, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }
  /**
   * Obtiene del backend la lista de syllabus en los cuales está registrado el usuario actual.
   */
  getEnrolledSyllabuses () {
    return this.httpService.httpClient
      .fetch(API.endpoints.enrolledSyllabus.replace('{1}', this.jwtService.getUserId()), {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Crea un nuevo syllabus en el sistema
   * @param {Syllabus} syllabus - Syllabus a crear
   */
  registerSyllabus (syllabus) {
    if (syllabus.privacy) syllabus.key = undefined
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tittle: syllabus.title,
          description: syllabus.description,
          public: syllabus.privacy,
          key: syllabus.key
        })
      })
      .then(this.httpService.checkStatus)
  }
}
