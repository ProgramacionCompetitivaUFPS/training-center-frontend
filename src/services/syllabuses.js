import { API } from 'config/config'
import { Assignment, Syllabus } from 'models/models'
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
   * Obtiene del backend los detalles de un syllabus específico.
   * @param {number} id - Identificador del syllabus a obtener
   * @returns {Promise} Promesa con el token de usuario
   */
  getSyllabus (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus + '/' + id, {
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

  /**
   * Edita un syllabus en el sistema
   * @param {Syllabus} syllabus - Syllabus a editar
   */
  editSyllabus (syllabus) {
    if (syllabus.privacy) syllabus.key = undefined
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus + '/' + syllabus.id, {
        method: 'put',
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

  /**
   * Elimina un syllabus de la plataforma
   * @param {number} id - Identificador del syllabus a eliminar
   */
  removeSyllabus (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus + '/' + id, {
        method: 'delete',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        }
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Registrar un estudiante en un syllabus.
   * @param {number} id - Identificador del syllabus
   * @param {string} key - Clave en syllabus privados
   */
  enrollSyllabus (id, key) {
    return this.httpService.httpClient
      .fetch(API.endpoints.syllabus + '/' + id + '/register', {
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
   * Crea una nueva tarea en el sistema
   * @param {Assignment} assignment - Tarea a crear
   */
  createAssignment (assignment) {
    return this.httpService.httpClient
      .fetch(API.endpoints.assignments, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tittle: assignment.title,
          description: assignment.description,
          init_date: assignment.startDate,
          end_date: assignment.endDate,
          syllabus_id: assignment.syllabusId,
          problems: assignment.problems
        })
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Edita una tarea en el sistema
   * @param {Assignment} assignment - Tarea a editar
   */
  editAssignment (assignment) {
    return this.httpService.httpClient
      .fetch(API.endpoints.assignments + '/' + assignment.id, {
        method: 'put',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tittle: assignment.title,
          description: assignment.description,
          init_date: assignment.startDate,
          end_date: assignment.endDate
        })
      })
      .then(this.httpService.checkStatus)
  }

  /**
   * Obtiene del backend los detalles de una tarea específica.
   * @param {number} id - Identificador de la tarea a obtener
   * @returns {Promise} Promesa con el token de usuario
   */
  loadAssignment (id) {
    return this.httpService.httpClient
      .fetch(API.endpoints.assignments + '/' + id, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Agrega problemas a una tarea
   * @param {Number} idAssignment - Id de la tarea de la cual se añaden las tareas
   * @param {Array} problems - Arrays con los id de los problemas a añadir
   */
  addProblems (idAssignment, problems) {
    return this.httpService.httpClient
      .fetch(API.endpoints.assignments + '/' + idAssignment + '/' + API.endpoints.addProblemAssignment, {
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
   * Elimina un problema de una tarea
   * @param {Number} idAssignment - Id de la tarea de la cual se borra el problema
   * @param {Number} idProblem - Id del problema a borrar
   */
  removeProblem (idAssignment, idProblem) {
    return this.httpService.httpClient
      .fetch(API.endpoints.assignments + '/' + idAssignment + '/' + API.endpoints.removeProblemAssignment, {
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
