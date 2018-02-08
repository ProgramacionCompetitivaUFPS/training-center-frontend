import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Syllabuses } from 'services/services'
/**
 * EditAssignment (Module)
 * Módulo encargado de editar tareas
 * @export
 * @class EditAssignment
 */
export class EditAssignment {
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
    this.assignment = params.assignment
    let startTmp = this.assignment.startDate.split(' ')
    let endTmp = this.assignment.endDate.split(' ')
    this.startDate = startTmp[0]
    this.endDate = endTmp[0]
    this.startTime = startTmp[1].substr(0, 5)
    this.endTime = endTmp[1].substr(0, 5)
    this.problems = this.assignment.problems.toString()
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
   * Agrega las ediciones a la plataforma
   */
  create () {
    if (!this.validateProblems()) {
      this.alertService.showMessage(MESSAGES.assignmentInvalidProblems)
    } else {
      this.assignment.startDate = this.startDate + ' ' + this.startTime + ':00'
      this.assignment.endDate = this.endDate + ' ' + this.endTime + ':00'
      this.syllabusService.editAssignment(this.assignment)
        .then(data => {
          this.modifyProblems()
          this.router.navigate('clases/' + this.assignment.syllabusId)
          this.alertService.showMessage(MESSAGES.assignmentModified)
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
