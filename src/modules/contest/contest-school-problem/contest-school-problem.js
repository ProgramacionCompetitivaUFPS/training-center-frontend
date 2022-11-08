import { inject, observable } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS } from 'config/config'
import { Contest, Problem, Enums } from 'models/models'
import { Alert, Auth, Contests, Problems } from 'services/services'

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Contests, Problems, Router)
export class ContestProblem {
  @observable now
  @observable dateLoaded
  @observable contestLoaded

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
    this.creatorId = 0
    this.status = 'registered'
    this.validDate = 0 // 0 => Valid, 1 => Prox, 2 => Pasada
    this.contTime = {}
    this.files = {}
    this.sourceValid = false;
    this.enums = Enums;
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

    //validar redireccion problemas de categoría diferente
    this.problemService
      .validateTypeCategory(this.id)
      .then((dataCategory) => {
        console.log("dataa ", dataCategory)
        if (dataCategory.type !== this.enums.typeCategory.school) {
          this.routerService.navigate("/");
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
        this.routerService.navigate("");
      });

    this.validDate = -1 // 0 => Valid, 1 => Prox, 2 => Pasada
    this.getContest()
  }

  contestLoadedChanged(act, prev) {
    this.validateDate()
  }
  dateLoadedChanged(act, prev) {
    this.validateDate()
  }

  validateDate () {
    if (this.contestLoaded && this.dateLoaded) {
      if (this.now < this.startDate) {
        this.routerService.navigateToRoute('detail', {id:this.contestId})
        this.alertService.showMessage(MESSAGES.contestNotStarted)
      } else {
        this.getStatus()
        this.validateSpecificDate()
      } 
    }
  }

  validateSpecificDate () {
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
    let endDate = new Date(this.contest.endDate)
    if (!this.sourceValid) {
      this.alertService.showMessage(MESSAGES.invalidCode)
    } else if (this.language === null) {
      this.alertService.showMessage(MESSAGES.invalidLanguage)
    } else if (this.now > endDate) {
      this.alertService.showMessage(MESSAGES.contestFinished)
    } else {
      this.files.codeFile = this.code[0]
      this.problemService.submitSolution(this.id, this.language, undefined, this.contestProblemId, this.files)
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
        if (this.status !== 'registered' && this.authService.getUserId() !== this.creatorId && !this.contest.privacy) {
          this.routerService.navigateToRoute('detail', {id:this.contestId})
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
        this.contest = new Contest(data.contest.title, data.contest.description, data.contest.init_date, data.contest.end_date, data.contest.rules, data.contest.public, null, this.contestId)
        this.startDate = new Date(data.contest.init_date)
        this.endDate = new Date(data.contest.end_date)
        this.contestLoaded = true
        this.creatorId = data.contest.user.id
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
        this.problem = new Problem(
          parseInt(this.id),
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
