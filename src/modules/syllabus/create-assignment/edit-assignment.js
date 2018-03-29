import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Auth, Syllabuses } from 'services/services'
/**
 * EditAssignment (Module)
 * Módulo encargado de editar tareas
 * @export
 * @class EditAssignment
 */

//dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de autenticación de usuarios (Auth), Servicio de obtención y edición de
// Syllabus (Syllabus), y enrutamiento (Router)
@inject(Alert, Auth, Syllabuses, Router)
export class EditAssignment {

  /**
   * Inicializa una instancia de EditAssignment
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} syllabusService - Servicio de obtención y manejo de clases
   * @param {service} router - Servicio de enrutamiento de aurelia
   */
  constructor (alertService, authService, syllabusService, router) {
    this.alertService = alertService
    this.authService = authService
    this.syllabusService = syllabusService
    this.router = router
    this.type = 'edit'
  }
  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate (params, routeConfig) {
    this.routeConfig = routeConfig
    this.id = params.id
    this.getAssignment()
  }

  /**
   * Define la ruta de la vista para este view-model.
   */
  getViewStrategy () {
    return './create-assignment.html'
  }

  /**
   * Formatea una fecha dada al formato YYYY-MM-DD
   * @param {Date} date - Fecha a formatear
   * @return {string} fecha formateada
   */
  formatDate (date) {
    let str = date.getUTCFullYear() + '-'
    if (date.getMonth() + 1 < 10) str += '0'
    str += (date.getMonth() + 1) + '-'
    if (date.getDate() < 10) str += '0'
    str += date.getDate()
    return str
  }

  /**
   * Formatea una hora dada al formato YYYY-MM-DD
   * @param {Date} time - Hora a formatear (Aunque se envia una fecha completa, solo se analiza la hora)
   * @return {string} Hora formateada
   */
  formatTime (time) {
    let str = ''
    if (time.getHours() < 10) str += '0'
    str += time.getHours() + ':'
    if (time.getMinutes() < 10) str += '0'
    str += time.getMinutes()
    return str
  }

  /**
   * Obtiene la tarea
   */
  getAssignment () {
    this.syllabusService.loadAssignment(this.id)
      .then(data => {
        let tmpStart = new Date(data.assignment.init_date)
        let tmpEnd = new Date(data.assignment.end_date)
        this.startDate = this.formatDate(tmpStart)
        this.endDate = this.formatDate(tmpEnd)
        this.startTime = this.formatTime(tmpStart)
        this.endTime = this.formatTime(tmpEnd)
        this.assignment = new Assignment(data.assignment.tittle, data.assignment.description, data.assignment.init_date, data.assignment.end_date, undefined, undefined, this.id)
        this.assignment.adjuntProblems(data.assignment.problems)
        this.problems = ''
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Muestra un popup para confirmar la eliminación del problema indicado por id.
   * @param {number} id - Identificador del problema a eliminar.
   */
  showRemoveProblem (id) {
    this.problemToRemove = id
    window.$('#remove-problem').modal('show')
  }

  /**
   * Agrega las ediciones a la plataforma
   */
  create () {
    this.assignment.startDate = new Date(this.startDate + ' ' + this.startTime).toISOString()
      this.assignment.endDate = new Date(this.endDate + ' ' + this.endTime).toISOString()
      this.syllabusService.editAssignment(this.assignment)
        .then(data => {
          this.alertService.showMessage(MESSAGES.assignmentModified)
        })
        .catch(error => {
          if (error.status === 401) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
  }

  /**
   * Elimina un problema de la tarea actual.
   */
  removeProblem () {
    this.syllabusService.removeProblem(this.id, this.problemToRemove)
      .then(() => {
        this.alertService.showMessage(MESSAGES.problemDeleted)
        this.assignment.removeProblem(this.problemToRemove)
        window.$('#remove-problem').modal('hide')
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#remove-problem').modal('hide')
      })
  }

  /**
   * Valida si la cadena de ids separados por comas es válida. De serlo, la agrega a assignment.problems
   * @return true si es válida, false si no
   */
  validateProblems () {
    let problemsTemp = this.problems.replace(/ /g, '')
    problemsTemp = problemsTemp.split(',')
    let problemsArr = []
    for (let i = 0; i < problemsTemp.length; i++) {
      if (problemsTemp[i].length > 0 && !isNaN(parseInt(problemsTemp[i]))) problemsArr.push(parseInt(problemsTemp[i]))
      else if (isNaN(parseInt(problemsTemp[i]))) return false
    }
    this.assignment.problems = problemsArr
    return true
  }

  /**
   * Añade los problemas almacenados en problems a la tarea.
   */
  addProblems () {
    if (!this.validateProblems()) {
      this.alertService.showMessage(MESSAGES.assignmentInvalidProblems)
    } else {
      this.syllabusService.addProblems(this.id, this.assignment.problems)
        .then(data => {
          this.alertService.showMessage(MESSAGES.assignmentCreated)
          this.getAssignment()
        })
        .catch(error => {
          if (error.status === 401) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    }
  }
}
