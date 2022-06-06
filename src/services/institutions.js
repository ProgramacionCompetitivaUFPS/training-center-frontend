import { inject } from 'aurelia-framework'
import { API } from 'config/config'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Problems (Service)
 * Servicio encargado del manejo de problemas y categorías
 * @export
 * @class Problems
 */
@inject(Http, Jwt)
export class Institutions {
    /**
     * Crea una instancia de Institutions.
     * @param {service} httpService - Servicio de conexión Http (Http)
     * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
     */
    constructor(httpService, jwtService) {
            this.jwtService = jwtService
            this.httpService = httpService
        }
        /**
         * Devuelve una lista de instituciones que son universidades identificadas 
         * por medio de el valor 0 del atributo institution
        @returns {Promise} promesa de universities
        */
    getUniversities() {
        return this.httpService.httpClient
            .fetch(API.endpoints.universities, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }
    getColleges() {
        return this.httpService.httpClient
            .fetch(API.endpoints.colleges, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Devuelve una lista de usuarios pertenecientes a una universidad
     * @param {any} id - Identificador de la categoría a obtener
     * @param {number} [page=1] - Página de resultados a obtener
     * @param {number} [limit=10] - Cantidad de resultados a obtener
     * @param {string} [sort='id'] - Modo de ordenamiento (id o level)
     * @param {string} [by='asc'] - Ordenamiento ascendente o descendente (asc o desc)
     * @param {string} [filter=null] - Selecciona por un lenguaje (null, es o en)
     * @returns {Promise} promesa de users
     */
    getUsersByInstitution(idInstitution, page = null, limit = null, sort = null, by = null, filter = null) {
        let data = '?'
        if (page !== null) {
            data += '&page=' + page
        }
        if (limit !== null) {
            data += '&limit=' + limit
        }
        if (sort !== null) {
            data += '&sort=' + sort
        }
        if (by !== null) {
            data += '&by=' + by
        }
        if (filter !== null) {
            data += '&filter=' + filter
        }
        return this.httpService.httpClient
            .fetch(API.endpoints.users + "/" + idInstitution + "/filter" + data, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Devuelve una lista de competencias pertenecientes a una universidad
     * @param {any} id - Identificador de la institucion a obtener
     * @param {number} [page=1] - Página de resultados a obtener
     * @param {number} [limit=10] - Cantidad de resultados a obtener
     * @param {string} [sort='id'] - Modo de ordenamiento (id o level)
     * @param {string} [by='asc'] - Ordenamiento ascendente o descendente (asc o desc)
     * @param {string} [filter=null] - Selecciona por un lenguaje (null, es o en)
     * @returns {Promise} promesa de contests
     */
    getContestsByInstitution(idInstitution, page = null, limit = null, sort = null, by = null, filter = null) {
        let data = '?'
        if (page !== null) {
            data += '&page=' + page
        }
        if (limit !== null) {
            data += '&limit=' + limit
        }
        if (sort !== null) {
            data += '&sort=' + sort
        }
        if (by !== null) {
            data += '&by=' + by
        }
        if (filter !== null) {
            data += '&filter=' + filter
        }
        return this.httpService.httpClient
            .fetch(API.endpoints.contests + "/" + idInstitution + "/filter" + data, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

}