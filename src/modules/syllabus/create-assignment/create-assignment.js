import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Syllabuses } from 'services/services'
/**
 * CreateAssignment (Module)
 * Módulo encargado de crear nuevas tareas
 * @export
 * @class CreateAssignment
 */
export class CreateAssignment {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de obtención y edición de Syllabus (Syllabus), y enrutamiento (Router)
   */
  static inject () {
    return [Alert, Syllabuses, Router]
  }
  constructor (alertService, syllabusService, router) {
    this.alertService = alertService
    this.syllabusService = syllabusService
    this.router = router
    this.problems = ''
    this.startDate = this.formatDate(new Date())
    this.endDate = this.startDate
    this.startTime = this.formatTime(new Date())
    this.endTime = this.startTime
    this.type = 'new'
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
    this.assignment = new Assignment()
    this.assignment.syllabusId = params.id
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

  create () {
    if (!this.validateProblems()) {
      this.alertService.showMessage(MESSAGES.assignmentInvalidProblems)
    } else {
      this.assignment.startDate = this.startDate + ' ' + this.startTime + ':00'
      this.assignment.endDate = this.endDate + ' ' + this.endTime + ':00'
      this.syllabusService.createAssignment(this.assignment)
        .then(data => {
          console.log(data)
          this.router.navigate('clases/' + this.assignment.syllabusId)
          this.alertService.showMessage(MESSAGES.assignmentCreated)
        })
        .catch(error => {
          console.log(error)
          if (error.status === 401) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    }
  }
}
