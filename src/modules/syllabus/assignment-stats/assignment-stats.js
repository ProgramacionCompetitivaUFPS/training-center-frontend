import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Syllabuses} from 'services/services'

@inject(Alert, Syllabuses)
export class AssignmentStats {
  // Elementos observables. 
  @observable page
  
  /**
   * Inicializa el ranking
   */
  constructor (alertService, syllabusService) {
    this.alertService = alertService
    this.syllabusService = syllabusService
    this.assignment = new Assignment()
    this.score = []
    this.mapProblem = [] // IDProblema - Index
    this.mapUsers = [] //IdUser - Index
    this.page = 1
    this.totalPages = 1
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
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if (prev !== undefined) this.getResults()
  }
    /**
   * Obtiene la tarea
   */
  getAssignment () {
    this.syllabusService.loadAssignment(this.id)
      .then(data => {
        this.assignment = new Assignment(data.assignment.tittle, data.assignment.description, data.assignment.init_date, data.assignment.end_date, undefined, undefined, this.id)
        this.assignment.adjuntProblems(data.assignment.problems)
        for(let i = 0; i < this.assignment.problemsLoaded.length; i++) {
          this.mapProblem[this.assignment.problemsLoaded[i].id] = i + 1
        }
        this.getResults()
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
   * Obtiene los resultados de la tarea.
   */
  getResults () {
    this.syllabusService.loadResults(this.id, this.page)
      .then(data => {
        for(let i = 0; i < data.length; i++) {
          if (this.mapUsers[data[i].id] === undefined) {
            this.mapUsers[data[i].id] = this.score.length
            this.score.push([])
            for(let j = 0; j <= this.assignment.problemsLoaded.length + 1; j++) this.score[this.mapUsers[data[i].id]].push(false)
            this.score[this.mapUsers[data[i].id]][0] = data[i].name
            this.score[this.mapUsers[data[i].id]][this.assignment.problemsLoaded.length + 1] = 0
          }
          if (data[i].problem_id !== null && !this.score[this.mapUsers[data[i].id]][this.mapProblem[data[i].problem_id]] ) {
            this.score[this.mapUsers[data[i].id]][this.mapProblem[data[i].problem_id]] = true
            this.score[this.mapUsers[data[i].id]][this.assignment.problemsLoaded.length + 1]++
          }
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  letterValue (index) {
    return String.fromCharCode(index + 65)
  }
}
