import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { MESSAGES } from 'config/config'
import { Contest, Problem } from 'models/models'
import { Alert, Contests } from 'services/services'

/**
 * EditContest (Module)
 * Módulo encargado de editar maratones de programación
 * @export
 * @class CreateContest
 */
@inject(Alert, Contests, Router)
export class EditContest {
  /**
   * Inicializa la instancia.
   */
  constructor (alertService, contestService, router) {
    this.alertService = alertService
    this.contestService = contestService
    this.router = router
    this.contest = new Contest()
    this.problems = []
    this.newProblems = ''
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
    this.getContest()
  }

  /**
   * Crea una nueva maratón en la plataforma.
   */
  edit () {
    this.contest.initDate = this.startDate + ' ' + this.startTime + ':00'
    this.contest.endDate = this.endDate + ' ' + this.endTime + ':00'
    this.contestService.editContest(this.contest)
      .then(data => {
        this.alertService.showMessage(MESSAGES.contestUpdated)
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Obtener los datos de la maratón actualmente cargada en la plataforma.
   */
  getContest () {
    this.contestService.getContest(this.id)
      .then(data => {
        this.contest = new Contest(data.contest.title, data.contest.description, data.contest.init_date, data.contest.end_date, data.contest.rules, data.contest.public, null, this.id)
        this.startDate = this.contest.initDate.substr(0, 10)
        this.endDate = this.contest.endDate.substr(0, 10)
        this.startTime = this.contest.initDate.substr(11, 5)
        this.endTime = this.contest.endDate.substr(11, 5)
        this.getProblems()
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Obtiene los problemas de la maratón
   */
  getProblems() {
    this.contestService.getProblems(this.id)
      .then(data => {
        this.problems = []
        for(let i = 0; i < data.contest.problems.length; i++) {
          this.problems.push(new Problem(data.contest.problems[i].id, data.contest.problems[i].title_en, data.contest.problems[i].title_es))
        }
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Valida si la cadena de ids separados por comas es válida. 
   * @return true si es válida, false si no
   */
  validateProblemsIds () {
    let problemsTemp = this.newProblems.replace(/ /g, '')
    problemsTemp = problemsTemp.split(',')
    let problemsArr = []
    for (let i = 0; i < problemsTemp.length; i++) {
      if (problemsTemp[i].length > 0 && !isNaN(parseInt(problemsTemp[i]))) problemsArr.push(parseInt(problemsTemp[i]))
      else if (isNaN(parseInt(problemsTemp[i]))) return false
    }
    this.newProblems = problemsArr
    return true
  }

  /**
   * Añade nuevos problemas a la maratón.
   */
  addProblems() {
    if(this.validateProblemsIds()) {
      this.contestService.addProblems(this.id, this.newProblems)
      .then(data => {
        this.getProblems()
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
    } else this.alertService.showMessage(MESSAGES.invalidIdProblem)
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
   * Elimina un problema de la maratón actual.
   */
  removeProblem () {
    this.contestService.removeProblem(this.id, this.problemToRemove)
      .then(() => {
        this.alertService.showMessage(MESSAGES.problemDeleted)
        this.getProblems()
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

}
