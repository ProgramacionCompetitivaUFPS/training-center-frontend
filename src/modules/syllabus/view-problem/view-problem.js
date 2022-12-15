import { inject, observable } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS, API } from 'config/config'
import { Problem, Assignment } from 'models/models'
import { Alert, Auth, Problems, Syllabuses } from 'services/services'


// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Problems, Syllabuses, Router)
export class ViewProblem {
  @observable now
  @observable assignmentLoaded
  @observable dateLoaded
  /**
   * Crea una instancia de ViewProblem.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, problemService, syllabusService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.problemService = problemService
    this.syllabusService = syllabusService
    this.routerService = routerService
    this.languages = SETTINGS.languages
    this.assignment = new Assignment()
    this.language
    this.code
    this.sourceValid = false
    this.validDate = -1 // 0 => Valid, 1 => Prox, 2 => Pasada
    this.now
  }

  assignmentLoadedChanged(act, prev) {
    this.validateDate()
  }

  dateLoadedChanged(act, prev) {
    this.validateDate()
  }

  validateDate () {
    if(this.dateLoaded && this.assignmentLoaded) {
      setInterval(() => {
        if (this.now < this.startDate) {
          this.validDate = 1
        } else if (this.now > this.endDate) {
          this.validDate = 2
        } else {
          this.validDate = 0
        }
      }, 1000)
      
    }
    
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
    this.assignmentId = params.assignmentId
    this.assignmentProblemId = params.assignmentProblemId
    this.problemId = params.problemId
    this.lang = params.lang || 'en'
    this.problemService.getProblem(this.problemId)
      .then(problem => {
        problem = problem.problem
        this.problem = new Problem(
          parseInt(params.problemId),
          problem.title_en,
          problem.title_es,
          parseInt(problem.level),
          parseInt(problem.category),
          undefined,
          undefined,
          problem.description_en,
          problem.description_es,
          problem.example_input !== "undefined"
            ? problem.example_input.replace(/\r\n/g, "\n")
            : "",
          problem.example_output !== "undefined"
            ? problem.example_output.replace(/\r\n/g, "\n")
            : "",
          parseFloat(problem.time_limit),
          problem.user_id,
          problem.user.username
        );
        if (this.lang === 'en' && !this.problem.isInEnglish()) {
          this.lang = 'es'
        } else if (this.lang === 'es' && !this.problem.isInSpanish()) {
          this.lang = 'en'
        }
        this.getAssignment()
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
   * Obtiene la tarea
   */
  getAssignment () {
    this.syllabusService.loadAssignment(this.assignmentId)
      .then(data => {
        this.startDate = new Date(data.assignment.init_date)
        this.endDate = new Date(data.assignment.end_date)
        this.assignmentLoaded = true
        this.assignment = new Assignment(data.assignment.tittle, data.assignment.description, data.assignment.init_date, data.assignment.end_date, undefined, data.assignment.syllabus_id, this.id)
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
      if (this.code[0].type.startsWith('text/') || this.code[0].name.endsWith('.java') || this.code[0].name.endsWith('.cpp') || this.code[0].name.endsWith('.c') || this.code[0].name.endsWith('.cc') || this.code[0].name.endsWith('.cp') || this.code[0].name.endsWith('.cxx') || this.code[0].name.endsWith('.py')) {  
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
        }else if(this.code[0].name.endsWith('.py')) {
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
      this.problemService.submitSolution(this.problemId, this.language, this.assignmentProblemId, undefined, this.code[0])
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
}
