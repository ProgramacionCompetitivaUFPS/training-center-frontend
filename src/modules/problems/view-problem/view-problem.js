import { inject } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS, API } from 'config/config'
import { Problem } from 'models/models'
import { Alert, Auth, Problems } from 'services/services'


// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Problems, Router)
export class ViewProblem {
  
  /**
   * Crea una instancia de ViewProblem.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, problemService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.problemService = problemService
    this.routerService = routerService
    this.languages = SETTINGS.languages
    this.language
    this.code
    this.sourceValid = false
    this.files = {}
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

    this.problemService.validateTypeCategory(this.id)
      .then(dataCategory => {

        if (dataCategory.type == 2 || dataCategory.type == 0){
           this.routerService.navigate('/');
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

    this.problemService.getProblem(this.id)
      .then(problem => {
        problem = problem.problem
        this.problem = new Problem(parseInt(params.id), problem.title_en, problem.title_es, parseInt(problem.level), parseInt(problem.category_id), undefined, problem.description_en, problem.description_es, problem.example_input !== 'undefined' ? problem.example_input.replace(/\r\n/g, '\n') : '', problem.example_output !== 'undefined' ? problem.example_output.replace(/\r\n/g, '\n') : '', parseFloat(problem.time_limit), problem.user_id, problem.user.username)
        if (problem.submissions.length > 0) this.problem.resolved = true
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
      if (this.code[0].name.endsWith('.java') || this.code[0].name.endsWith('.cpp') || this.code[0].name.endsWith('.c') || this.code[0].name.endsWith('.cc') || this.code[0].name.endsWith('.cp') || this.code[0].name.endsWith('.cxx') || this.code[0].name.endsWith('.py')) {
        this.sourceValid = true
        if(this.code[0].name.endsWith('.java')) {
          this.language = 'Java'
          var reader = new FileReader()
          reader.onload = () => {
            let tmp = reader.result.replace(/ /g, '')
            tmp = tmp.replace(/\n|\r\n|\r/g, '')
            if (tmp.search('publicclassMain') < 0) {
              this.code = null
              this.sourceValid = false
              this.alertService.showMessage(MESSAGES.invalidJavaClassname)
            }
          }
          reader.readAsText(this.code[0])
        } else if(this.code[0].name.endsWith('.py')) {
          this.language = 'Python'
        } else if(this.code[0].name.endsWith('.cpp') || this.code[0].name.endsWith('.c') || this.code[0].name.endsWith('.cc') || this.code[0].name.endsWith('.cp') || this.code[0].name.endsWith('.cxx')) {
          this.language = 'C++'
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

      this.files.codeFile = this.code[0]

      this.problemService.submitSolution(this.id, this.language, undefined, undefined, this.files)
        .then((data) => {
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

}
