import { inject } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS } from 'config/config'
import { Problem } from 'models/models'
import { Alert, Problems } from 'services/services'

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Problems, Router)
export class ViewProblem {
  
  /**
   * Crea una instancia de ViewProblem.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, problemService, routerService) {
    this.alertService = alertService
    this.problemService = problemService
    this.routerService = routerService
    this.languages = SETTINGS.languages
    this.sourceValid = false
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
    this.lang = params.lang || 'en'
    this.problemService.getProblem(this.id)
      .then(problem => {
        problem = problem.problem
        this.problem = new Problem(parseInt(params.id), problem.title_en, problem.title_es, parseInt(problem.level), parseInt(problem.category), undefined, problem.description_en, problem.description_es, problem.example_input.replace(/\r\n/g, '\n'), problem.example_output.replace(/\r\n/g, '\n'), parseFloat(problem.time_limit), problem.user_id, problem.user.username)
        console.log(this.problem.exampleInput)
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
          console.log(error)
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        this.routerService.navigate('')
      })
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
   * TODO:
   * Valida que el código enviado tiene uno de los formatos permitidos
   */
  validateCode () {
    this.sourceValid = true
  }
}
