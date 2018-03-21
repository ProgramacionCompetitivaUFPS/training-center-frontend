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

  /**
   * Inscribe a un usuario en una maratón.
   * @param {Number} id - Identificador de la maratón
   * @param {String} keyContest - Clave de la maratón
   */
  enroll (id, keyContest) {
    let key = undefined
    if (keyContest !== '') key = keyContest 
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id + '/register', {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: key
        })
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Elimina a un usuario de una maratón.
   * @param {Number} id - Identificador de la maratón
   */
  unenroll (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id + '/unregister', {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        }
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Edita los datos de una maratón en el sistema
   * @param {Contest} contest - Maratón a editar
   */
  editContest (contest) {
    let key = undefined
    if (!contest.public) key = contest.key 
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + contest.id, {
        method: 'PUT',
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

  /**
   * Obtiene la lista de maratones para un usuario especifico (Si el usuario es undefined, para todos).
   * @param {Number} limit - Cantidad de maratones a obtener.
   * @param {Number} page - Página a obtener.
   * @param {Number} userId - Identificador de usuario.
   */
  getMyContests (limit, page, userId) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '?limit=' + limit + '&page=' + page + '&user=' + userId, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene todas las maratones próximas.
   * @param {Number} limit - Cantidad de maratones a obtener.
   * @param {Number} page - Página a obtener
   */
  getContests (limit, page) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '?limit=' + limit + '&page=' + page, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene los problemas de una maratón.
   * @param {Number} id - Identificador de la maratón.
   */
  getProblems (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id + '/' + API.endpoints.problems, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene los datos de una maratón específica.
   * @param {Number} id - Identificador de la maratón a obtener.
   */
  getContest (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene los problemas de una maratón específica.
   * @param {Number} id - Identificador de la maratón a obtener.
   */
  getProblemsContest(id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id + '/' + API.endpoints.problems, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene el status (registrado o no) de un usuario.
   * @param {Number} idContest - Identificador de la maratón a obtener.
   * @param {Number} idUser - Identificador del usuario.
   */
  getStatus (idContest, idUser) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + idContest + '/is-register?student=' + idUser, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Añade uno o varios problemas al contest
   * @param {Number} id - Id del contest.
   * @param {Array} problems - Array con el id de los problemas a añadir.
   */
  addProblems (id, problems) {
    return this.httpService.httpClient
      .fetch(API.endpoints.contests + '/' + id + '/' + API.endpoints.problems, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          problems: problems
        })
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Elimina un problema de un contest.
   * @param {Number} idContest - Id del contest a eliminar.
   * @param {Number} idProblem - Id del problema a eliminar.
   */
  removeProblem (idContest, idProblem) {
    return this.httpService.httpClient
        .fetch(API.endpoints.contests + '/' + idContest + '/remove-problems', {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + this.jwtService.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            problems: [idProblem]
          })
        })
        .then(this.httpService.checkStatus)
  }
}
