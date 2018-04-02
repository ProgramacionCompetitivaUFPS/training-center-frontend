import { inject } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS } from 'config/config'
import { Contest, Problem } from 'models/models'
import { Alert, Auth, Contests, Problems } from 'services/services'

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Contests, Problems, Router)
export class ContestProblem {
  
  /**
   * Crea una instancia de ViewProblem.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, contestService, problemService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.problemService = problemService
    this.contestService = contestService
    this.routerService = routerService
    this.languages = SETTINGS.languages
    this.sourceValid = false
    this.code
    this.status = 'unverified'
    this.validDate = 0 // 0 => Valid, 1 => Prox, 2 => Pasada
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
    this.contestId = params.id
    this.contestProblemId = params.contestProblemId
    this.id = params.problemId
    this.lang = params.lang || 'en'
    this.getContest()
  }

  /**
   * Si existe, muestra la versión en español del problema.
   */
  showES () {
    if (this.problem.isInSpanish()) {
      this.lang = 'es'
    }
  }

  /**
   * Si existe, muestra la versión en ingles del problema.
   */
  showEN () {
    if (this.problem.isInEnglish()) {
      this.lang = 'en'
    }
  }

  /**
   * Valida que el código enviado tiene uno de los formatos permitidos
   */
  validateCode () {
    if (this.code.length === 1) {
      if (this.code[0].type.startsWith('text/') || this.code[0].name.endsWith('.java') || this.code[0].name.endsWith('.cpp') || this.code[0].name.endsWith('.py')) {
        this.sourceValid = true
        if(this.code[0].name.endsWith('.java')) {
          var reader = new FileReader()
          reader.onload = () => {
            let tmp = reader.result.replace(/ /g, '')
            tmp = tmp.replace(/\n|\r\n|\r/g, '')
            if (tmp.search('publicclassMain{') < 0) {
              this.code = null
              this.sourceValid = false
              this.alertService.showMessage(MESSAGES.invalidJavaClassname)
            }
          }
          reader.readAsText(this.code[0])
        }
      } else {
        this.code = null
        this.sourceValid = false
        this.alertService.showMessage(MESSAGES.invalidCode)
      }
    }  
  }

  submit() {
    if (!this.sourceValid) {
      this.alertService.showMessage(MESSAGES.invalidCode)
    } else if (this.language === null) {
      this.alertService.showMessage(MESSAGES.invalidLanguage)
    } else {
      this.problemService.submitSolution(this.id, this.language, undefined, this.contestProblemId, this.code[0])
        .then(() => {
          this.alertService.showMessage(MESSAGES.submittedSolution)
          this.language = null
          this.code = null
          this.sourceValid = false
        })
        .catch(error => {
          if (error.status === 401 || error.status === 403) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else if (error.status === 500) {
            this.alertService.showMessage(MESSAGES.serverError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    }
  }

  /**
   * Obtiene el estado actual del estudiante en una maratón.
   */
  getStatus () {
    this.contestService.getStatus(this.contestId, this.authService.getUserId())
      .then(data => {
        this.status = data.status
        if (this.status !== 'registered') {
          this.routerService.navigate('#/maraton/' + this.contestId)
          this.alertService.showMessage(MESSAGES.contestProblemsNotRegistered)
        } else {
          this.getProblem()
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
   * Obtiene la información de la maratón actual.
   */
  getContest () {
    this.contestService.getContest(this.contestId)
      .then(data => {
        this.contest = new Contest(data.contest.title, data.contest.description, data.contest.init_date, data.contest.end_date, data.contest.rules, data.contest.public, null, this.id)
        let startDate = new Date(data.contest.init_date)
        let now = new Date()
        if (now < startDate) {
          this.routerService.navigate('#/maraton/' + this.id)
          this.alertService.showMessage(MESSAGES.contestNotStarted)
        } else if (this.contest.privacy){
          this.getProblem()
        } else {
          this.getStatus()
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

  getProblem() {
    this.problemService.getProblem(this.id)
      .then(problem => {
        problem = problem.problem
        this.problem = new Problem(parseInt(this.id), problem.title_en, problem.title_es, parseInt(problem.level), parseInt(problem.category), undefined, problem.description_en, problem.description_es, (problem.example_input !== 'undefined' ? problem.example_input.replace(/\r\n/g, '\n') : ''), (problem.example_output !== 'undefined' ? problem.example_output.replace(/\r\n/g, '\n') : ''), parseFloat(problem.time_limit), problem.user_id, problem.user.username)
        if (this.lang === 'en' && !this.problem.isInEnglish()) {
          this.lang = 'es'
        } else if (this.lang === 'es' && !this.problem.isInSpanish()) {
          this.lang = 'en'
        }
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        this.routerService.navigate('')
      })
  }

}
