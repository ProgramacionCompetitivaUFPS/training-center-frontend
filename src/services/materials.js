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
   * @param {Number} page - Página de materiales a obtener
   * @param {Number} limit - Cantidad de materiales a obtener
   * @param {string} sort - opcional, por defecto ordena por id, si sort es 'name' ordena por nombre
   * @param {string} by - asc o desc, ordenamiento ascendente o descendente
   * @returns {Promise} Promesa con el token de usuario
   */
  getCategoryMaterial (idCategory, page, limit, sort, by) {
    return this.httpService.httpClient
      .fetch(API.endpoints.categories + '/' + idCategory + '/' + API.endpoints.materials + '?page=' + page + '&limit=' + limit + '&sort=' + sort + '&by=' + by, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene del backend la lista de materiales públicos.
   * @param {Number} page - Página de materiales a obtener
   * @param {Number} limit - Cantidad de materiales a obtener
   * @param {string} sort - opcional, por defecto ordena por id, si sort es 'name' ordena por nombre
   * @param {string} by - asc o desc, ordenamiento ascendente o descendente
   * @returns {Promise} Promesa con los materiales.
   */
  getPublicMaterial (page, limit, sort, by) {
    return this.httpService.httpClient
      .fetch(API.endpoints.materials + '?page=' + page + '&limit=' + limit + '&sort=' + sort + '&by=' + by, {
        method: 'get'
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene del backend la lista de materiales pendientes de aprobación.
   * @param {Number} page - Página de materiales a obtener
   * @param {Number} limit - Cantidad de materiales a obtener
   * @param {string} sort - opcional, por defecto ordena por id, si sort es 'name' ordena por nombre
   * @param {string} by - asc o desc, ordenamiento ascendente o descendente
   * @returns {Promise} Promesa con los materiales.
   */
  getPendingMaterial (page, limit, sort, by) {
    return this.httpService.httpClient
      .fetch(API.endpoints.materials + '/pending' + '?page=' + page + '&limit=' + limit + '&sort=' + sort + '&by=' + by, {
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

  /**
   * Crea un nuevo material en la plataforma.
   * @param {Material} material - Material a añadir
   * @returns {Promise} Promesa sin body, para validar según el status.
   */
  createMaterial (material) {
    if (!material.isPdf) {
      return this.httpService.httpClient
        .fetch(API.endpoints.materials, {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              name: material.name,
              category: material.category,
              description: material.description,
              content: 'url',
              url: material.url
            }
          })
        })
        .then(this.httpService.checkStatus)
    } else {
      let data = new window.FormData()
      data.append('data[name]', material.name)
      data.append('data[category]', material.category)
      data.append('data[description]', material.description)
      data.append('data[content]', 'pdf')
      data.append('pdf', material.pdf[0])
      return this.httpService.httpClient
        .fetch(API.endpoints.materials, {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token
          },
          body: data
        })
        .then(this.httpService.checkStatus)
    }
  }

  /**
   * Aprueba el material indicado.
   * @param {Number} id - Id del material a aprobar.
   */
  approve (id) {
    return this.httpService.httpClient
        .fetch(API.endpoints.materials + '/' + id, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token,
            'Content-Type': 'application/json'
          }
        })
        .then(this.httpService.checkStatus)
  }

  /**
   * Elimina el material indicado.
   * @param {Number} id - Id del material a eliminar.
   */
  remove (id) {
    return this.httpService.httpClient
        .fetch(API.endpoints.materials + '/' + id, {
          method: 'delete',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token,
            'Content-Type': 'application/json'
          }
        })
        .then(this.httpService.checkStatus)
  }
}
