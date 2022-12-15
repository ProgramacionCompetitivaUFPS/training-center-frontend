import { inject } from "aurelia-framework";
import { API } from "config/config";
import { Http } from "services/http";
import { Jwt } from "services/jwt";

/**
 * Problems (Service)
 * Servicio encargado del manejo de categorías
 * @export
 * @class Categories
 */
@inject(Http, Jwt)
export class Categories {
  /**
   * Crea una instancia de Category.
   * @param {service} httpService - Servicio de conexión Http (Http)
   * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
   */
  constructor(httpService, jwtService) {
    this.jwtService = jwtService;
    this.httpService = httpService;
  }

  /**
   * Obtener categoría buscando por materiales
   * @param {number} materialId - Identificador del material
   * @returns {Promise} promesa con la id de la categoría.
   * */
  getCategoryByMaterial(materialId) {
    return this.httpService.httpClient
      .fetch(API.endpoints.categories + "?material=" + materialId, {
        method: "get",
        headers: {
          Authorization: "Bearer " + this.jwtService.token,
        },
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON);
  }

  /**
   * Obtiene del backend los atributos de una categoría específico dado.
   * @param {Number} idCategory - Id de la categoría
   * @returns {Promise} Promesa con el token de usuario
   */
   getCategory (idcategory) {
    return this.httpService.httpClient
      .fetch(API.endpoints.categories + '/' + idcategory, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }
}
