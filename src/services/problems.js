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
export class Problems {

    /**
     * Crea una instancia de Problems.
     * @param {service} httpService - Servicio de conexión Http (Http)
     * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
     */
    constructor(httpService, jwtService) {
            this.jwtService = jwtService
            this.httpService = httpService
        }
        /**
         * Obtiene del backend la lista de categorías existentes.
         * @returns {Promise} Promesa con el token de usuario
         */
    getCategories(type_category) {
        return this.httpService.httpClient
            .fetch(API.endpoints.categories + '?type=' + type_category, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    getCategories2() {
        return this.httpService.httpClient
            .fetch(API.endpoints.categories, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Crea una nueva categoría en la plataforma.
     * @param {string} name - Nombre de la categoría
     * @returns {Promise} Promesa sin body, para validar según el status.
     */
    createCategory(name, typeCategory) {
        return this.httpService.httpClient
            .fetch(API.endpoints.categories, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    type_category: typeCategory
                })
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Edita el nombre de una categoría en la plataforma.
     * @param {number} id - Identificador de la categoría a editar.
     * @param {string} name - Nuevo nombre de la categoría.
     * @return {Promise} Promesa indicando el exito o fracaso de la operación.
     */
    editCategory(id, name) {
        return this.httpService.httpClient
            .fetch(API.endpoints.categories + '/' + id, {
                method: 'put',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name
                })
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Elimina una categoría de la plataforma.
     * @param {number} id - Identificador de la categoría a eliminar.
     */
    removeCategory(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.categories + '/' + id, {
                method: 'delete',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Obtiene la lista de problemas de una categoría específica. Como pueden ser muchos problemas,
     * el método realiza "paginación" permitiendo traer así solo un número determinado de problemas
     * según los parámetros establecidos.
     * @param {any} id - Identificador de la categoría a obtener
     * @param {number} [page=1] - Página de resultados a obtener
     * @param {number} [limit=10] - Cantidad de resultados a obtener
     * @param {string} [sort='id'] - Modo de ordenamiento (id o level)
     * @param {string} [by='asc'] - Ordenamiento ascendente o descendente (asc o desc)
     * @param {string} [filter=null] - Selecciona por un lenguaje (null, es o en)
     * @returns {Promise} Promesa con los problemas obtenidos
     */
    getCategoryProblems(id, page = null, limit = null, sort = null, by = null, filter = null) {
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
            .fetch(API.endpoints.categoryProblems.replace('{1}', id) + data, {
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
     * Lee un problema desde la plataforma.
     * @param {number} id - Identificador del problema.
     */
    getProblem(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + id, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    getDataFile(id, folder, filename) {
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + id + '/' + folder + '/' + filename, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseBlob)
    }

    getSubmission(name) {
        return this.httpService.httpClient
            .fetch(API.endpoints.submissions + '/' + name, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseBlob)
    }

    getSubmissionLog(name) {
        return this.httpService.httpClient
            .fetch(API.endpoints.submissions + '/' + name + '/log', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseBlob)
    }

    getSvgSubmission(name) {
        return this.httpService.httpClient
            .fetch(API.endpoints.submissions + '/' + name + '/svgSubmission', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseBlob)
    }

    /**
     * Envia un nuevo problema en el servidor
     * @param {Problem} problem - Problema a subir en el servidor
     */
    createProblem(problem) {
        var data = new window.FormData()
            // Datos obligatorios
        data.append('data[category]', problem.category)
        data.append('data[level]', problem.level)
        data.append('data[example_input]', problem.exampleInput)
        data.append('data[example_output]', problem.exampleOutput)
        data.append('data[time_limit]', problem.timeLimit)
            // Datos opcionales
        if (problem.titleEN !== undefined) data.append('data[title_en]', problem.titleEN)
        if (problem.titleES !== undefined) data.append('data[title_es]', problem.titleES)
        if (problem.descriptionEN !== undefined) data.append('data[description_en]', problem.descriptionEN)
        if (problem.descriptionES !== undefined) data.append('data[description_es]', problem.descriptionES)
            // Archivos
        data.append('input', problem.input[0])
        data.append('output', problem.output[0])
        return this.httpService.httpClient
            .fetch(API.endpoints.problems, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                },
                body: data
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Envia al servidor un problema editado
     * @param {Problem} problem - Problema a editar en el servidor
     */
    editProblem(problem) {
        var data = new window.FormData()
            // Datos obligatorios
        data.append('data[category]', problem.category)
        data.append('data[level]', problem.level)
        data.append('data[example_input]', problem.exampleInput)
        data.append('data[example_output]', problem.exampleOutput)
        data.append('data[time_limit]', problem.timeLimit)
            // Datos opcionales
        if (problem.titleEN !== undefined && problem.titleEN !== null) data.append('data[title_en]', problem.titleEN)
        if (problem.titleES !== undefined && problem.titleES !== null) data.append('data[title_es]', problem.titleES)
        if (problem.descriptionEN !== undefined && problem.descriptionEN !== null) data.append('data[description_en]', problem.descriptionEN)
        if (problem.descriptionES !== undefined && problem.descriptionES !== null) data.append('data[description_es]', problem.descriptionES)
            // Archivos
        if (problem.input !== undefined && problem.input !== null) data.append('input', problem.input[0])
        if (problem.output !== undefined && problem.output !== null) data.append('output', problem.output[0])
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + problem.id, {
                method: 'put',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                },
                body: data
            })
            .then(this.httpService.checkStatus)
    }

    /**
     * Elimina un problema de la plataforma.
     * @param {number} id - Identificador del problema a eliminar.
     */
    removeProblem(id) {
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + id, {
                method: 'delete',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Envia un problema para su calificación
     * @param {number} problemId - Identificador del problema a evaluar
     * @param {string} languaje - lenguaje en el que está el formato de la submission
     * @param {number} assignmentId - Identificador de la tarea
     * @param {number} contestId - Identificador del contest
     * @param {file} code - Código a evaluar
     * @param {file} XMLCode - submission en formato XML, para los envíos vía Blockly
     */
    submitSolution(problemId, language, assignmentId, contestId, files) {

        var data = new window.FormData()
        data.append('data[language]', language)
        if (assignmentId !== undefined) data.append('data[assignment_problem_id]', assignmentId)
        if (contestId !== undefined) data.append('data[contest_problem_id]', contestId)

        data.append('code', files.codeFile)

        let blocklySubmission = 0;
        
        if (files.svgBlocklyCode !== undefined){
            data.append('svgBlocklyCode', files.svgBlocklyCode)
            blocklySubmission = 1
        }  
        
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + problemId + '/submit', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token,
                    blocklySubmission
                },
                body: data
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Busca problemas en el backend.
     * @param {string} query - Texto a buscar
     * @param {Number} page - Página de problemas a obtener
     * @param {Number} limit - Cantidad de problemas a obtener
     * @param {string} sort - opcional, por defecto ordena por id, si sort es 'name' ordena por nombre
     * @param {string} by - asc o desc, ordenamiento ascendente o descendente
     * @param {Number} typeCategory - Colegio o universidad
     * @returns {Promise} Promesa con los problemas.
     */
    searchProblems(query, page, limit, sort, by, lang, typeCategory) {
        let q = '?search=' + query + '&page=' + page + '&limit=' + limit
        if (sort !== undefined) q += '&sort=' + sort
        if (by !== undefined) q += '&by=' + by
        if (lang !== undefined) q += '&filter=' + lang
        if (typeCategory !== undefined && typeCategory !== null) q += '&typeCategory=' + typeCategory
        
        return this.httpService.httpClient
            .fetch(API.endpoints.problems + q, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
    }

    /**
     * Valida que el problema se esté mostrando en tipo de categoría correcta, para este caso, problemas de TC university
     * @param {number} problemId - Identificador del problema
     * @returns {Promise} promesa con la id de la categoría. 
     * */
    validateTypeCategory(idProblem){

        return this.httpService.httpClient
            .fetch(API.endpoints.problems + '/' + idProblem + '/validateCategory', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + this.jwtService.token
                }
            })
            .then(this.httpService.checkStatus)
            .then(this.httpService.parseJSON)
            
    }
    
}