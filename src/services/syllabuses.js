import { inject } from 'aurelia-framework'

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

// dependencias a inyectar: Servicio de conexión Http (Http),
// servicio de manejo de Json Web Tokens (Jwt)
@inject(Http, Jwt)
export class Syllabuses {

    /**
     * Crea una instancia de Syllabus.
     * @param {service} httpService - Servicio de conexión Http (Http)
     * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
     */
    constructor(httpService, jwtService) {
        this.jwtService = jwtService
        this.httpService = httpService
    }

    /**
     * Obtiene del backend la lista de syllabus existentes.
     * @param {number} limit - cantidad de syllabuses a obtener
     * @param {number} page - página actual
     * @param {number} coach - opcional. Id del coach
     * @param {number} type - Tipo de syllabus (0 para universidades, 1 para colegios)
     * @returns {Promise} Promesa con el token de usuario
     */
    getSyllabuses(limit, page, coach, type) {
            let data = '?limit=' + limit + '&page=' + page + '&type=' + type

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
         * @param {number} type - Tipo de syllabus (0 para universidades, 1 para colegios)
         */
    getEnrolledSyllabuses(type) {
        let data = '?type=' + type

        return this.httpService.httpClient
            .fetch(API.endpoints.enrolledSyllabus.replace('{1}', this.jwtService.getUserId()) + data, {
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
    getSyllabus(id) {
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
    registerSyllabus(syllabus) {
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
                    key: syllabus.key,
                    type: syllabus.type
                })
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Edita un syllabus en el sistema
     * @param {Syllabus} syllabus - Syllabus a editar
     */
    editSyllabus(syllabus) {
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
    removeSyllabus(id) {
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
    enrollSyllabus(id, key) {
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
    createAssignment(assignment) {
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
     * Obtiene del backend las estadisticas de un syllabus.
     */
    getStatistics(id, limit, page) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + id + '/' + API.endpoints.ranking + '?limit=' + limit + '&page=' + page, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Edita una tarea en el sistema
     * @param {Assignment} assignment - Tarea a editar
     */
    editAssignment(assignment) {
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
    loadAssignment(id) {
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
     * Obtiene del backend los materiales del syllabus.
     * @param {number} id - Identificador del syllabus del cual se obtendrá el material
     * @returns {Promise} Promesa con los materiales
     */
    loadMaterials(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + id + '/' + API.endpoints.materials, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Obtiene del backend los resultados de una tarea.
     * @param {number} id - Identificador de la tarea del cual se obtendrán los resultados.
     * @returns {Promise} Promesa con los resultados
     */
    loadResults(id, page) {
        return this.httpService.httpClient
            .fetch(API.endpoints.assignments + '/' + id + '/results?limit=20&page=' + page, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }


    loadStatsByVerdict(idAssignment, idProblem) {
        return this.httpService.httpClient
            .fetch(API.endpoints.assignments + '/' + idAssignment + '/verdicts/' + idProblem, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    loadStatsByLang(idAssignment, idProblem) {
        return this.httpService.httpClient
            .fetch(API.endpoints.assignments + '/' + idAssignment + '/languages/' + idProblem, {
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
     * @param {Number} idAssignment - Id de la tarea a la cual se añaden los problemas
     * @param {Array} problems - Array con los id de los problemas a añadir
     */
    addProblems(idAssignment, problems) {
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
     * Agrega materiales a un syllabus
     * @param {Number} idSyllabus - Id del syllabus al cual se añaden los materiales
     * @param {Array} materials - Array con los id de los materiales a añadir
     */
    addMaterials(idSyllabus, materials) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + idSyllabus + '/' + API.endpoints.addMaterials, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    materials: materials
                })
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Elimina un problema de una tarea
     * @param {Number} idAssignment - Id de la tarea de la cual se borra el problema
     * @param {Number} idProblem - Id del problema a borrar
     */
    removeProblem(idAssignment, idProblem) {
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

    /**
     * Elimina un material de un syllabus
     * @param {Number} idSyllabus - Id del syllabus del cual se borra el material
     * @param {Number} idMaterial - Id del material a borrar
     */
    removeMaterial(idSyllabus, idMaterial) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + idSyllabus + '/' + API.endpoints.removeMaterialSyllabus, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    materials: [idMaterial]
                })
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Elimina un usuario de la base de datos.
     */
    removeUser(idSyllabus) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + idSyllabus + '/delete-students', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Elimina un usuario de la base de datos.
     */
    removeUserFromCoach(idSyllabus, idUser) {
        return this.httpService.httpClient
            .fetch(API.endpoints.syllabus + '/' + idSyllabus + '/delete-students', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    students: [idUser]
                })
            })
            .then(this.httpService.checkStatus)
    }

    getSubmissionsAssignment(assignmentId, problemId, limit, page, by, sort, condition) {
        let strt = ''
        if (condition !== null) strt = '&condition=' + condition
        return this.httpService.httpClient
            .fetch(API.endpoints.assignments + '/' + assignmentId + '/' + API.endpoints.submissions + '/' + problemId + '?limit=' + limit + '&page=' + page + '&by=' + by + '&sort=' + sort + strt, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }
}