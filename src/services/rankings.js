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
    constructor(httpService, jwtService) {
            this.jwtService = jwtService
            this.httpService = httpService
        }
        /**
         * Obtiene del backend el ranking.
         */
    getRanking(limit, page) {
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

    getRankingInstitution(limit, page, id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/ranking/' + API.endpoints.ranking2 + '?limit=' + limit + '&page=' + page + '&id=' + id, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)

    }

    getRankingAnio(limit, page, año) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/ranking/' + API.endpoints.ranking3 + '?limit=' + limit + '&page=' + page + '&anio=' + año, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)

    }

    getRankingCategory(limit, page, category){
        return this.httpService.httpClient
        .fetch(API.endpoints.users + '/' + API.endpoints.rankingCategory + '?limit=' + limit + '&page=' + page + '&category=' + category, {
          method: 'get',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token
          }
        })
        .then(this.httpService.checkStatus)
        .then(this.httpService.parseJSON)
    
      }

    getSubmissions(userId, limit, page, by, sort, condition) {
        let strt = ''
        if (condition !== null) strt = '&condition=' + condition
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + userId + '/' + API.endpoints.submissions + '?limit=' + limit + '&page=' + page + '&by=' + by + '&sort=' + sort + strt, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    getSubmissionsByContest(cid, usrid) {
        console.log(`${API.endpoints.users}/${API.endpoints.submissions}/contest?cid=${cid}&usrid=${usrid}`);
        return this.httpService.httpClient
          .fetch(`${API.endpoints.users}/${API.endpoints.submissions}/contest?cid=${cid}&usrid=${usrid}`, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + this.jwtService.token
            }
          })
          .then(this.httpService.checkStatus)
          .then(this.httpService.parseJSON)
    }

    loadStatsByVerdict(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + id + '/verdicts', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    loadProfile(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + id, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    loadStatsByLang(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.users + '/' + id + '/languages', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

}