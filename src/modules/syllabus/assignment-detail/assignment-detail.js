import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Problems, Syllabuses} from 'services/services'

@inject(Alert, Problems, Syllabuses)
export class AssignmentDetail {
  // Elementos observables. 
  @observable page
  @observable filterChange
  
  /**
   * Inicializa el ranking
   */
  constructor (alertService, problemService, syllabusService) {
    this.alertService = alertService
    this.syllabusService = syllabusService
    this.problemService = problemService
    this.assignment = new Assignment()
    this.numberOfItems = [10, 15, 20]
    this.sortOptions = ['Fecha', 'Tiempo de ejecución']
    this.filterChange = false
    this.limit = 10
    this.sort = 'Fecha'
    this.by = 'Descendente'
    this.page = 1
    this.downloadActive = false
    this.totalPages = 1
    this.problem = ''
    this.veredictOptions = [
      {value : 'ALL', text : 'Cualquier veredicto'},
      {value : 'ACC', text : 'Correcto'},
      {value : 'TL', text : 'Tiempo límite excedido'},
      {value : 'WA', text : 'Respuesta incorrecta'},
      {value : 'RT', text : 'Error en tiempo de ejecución'},
      {value : 'CE', text : 'Error de compilación'}
    ] 
    this.veredict = this.veredictOptions[0]
    this.veredicts = {
      labels: ['Correcto', 'Tiempo limite excedido', 'Error en tiempo de ejecución', 'Error de compilación', 'Respuesta incorrecta'],
      datasets: [{
          label: 'Resultados',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
              'rgba(46, 204, 113,1.0)',
              'rgba(52, 152, 219,1.0)',
              'rgba(155, 89, 182,1.0)',
              'rgba(251, 197, 49,1.0)',
              'rgba(255, 99, 132,1.0)'
          ],
          borderWidth: 0
      }]
    }
    this.langs = {
      labels: ['Java', 'C++', 'Python'],
      datasets: [{
          label: 'Lenguajes usados',
          data: [0, 0, 0],
          backgroundColor: [
              'rgba(46, 204, 113,1.0)',
              'rgba(52, 152, 219,1.0)',
              'rgba(255, 99, 132,1.0)'
          ],
          borderWidth: 0
      }]
    }
  }

  setVeredict(veredict) {
    this.veredict = veredict
    this.getSubmissions()
  }

  /**
   * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
  filterChangeChanged (act, prev) {
    if(prev !== undefined) this.getSubmissions()
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
    this.idProblem = params.idProblem
    this.idAssignment = params.idAssignment
    this.idAssignmentProblem = params.idAssignmentProblem
    this.getAssignment()
    this.getStatsByVerdict()
    this.getStatsByLang()
    this.getSubmissions()
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if (prev !== undefined) this.getSubmissions()
  }
    /**
   * Obtiene la tarea
   */
  getAssignment () {
    this.syllabusService.loadAssignment(this.idAssignment)
      .then(data => {
        this.assignment = new Assignment(data.assignment.tittle, data.assignment.description, data.assignment.init_date, data.assignment.end_date, undefined, data.assignment.syllabus_id, this.idAssignment)
        for(let i = 0; i < data.assignment.problems.length; i++) {
          if(data.assignment.problems[i].id == this.idProblem) {
            if(data.assignment.problems[i].title_es !== null) this.problem = data.assignment.problems[i].title_es
            else this.problem = data.assignment.problems[i].title_en
            break
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

  getStatsByVerdict() {
    this.syllabusService.loadStatsByVerdict(this.idAssignment, this.idAssignmentProblem)
      .then (data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].verdict === 'Accepted') this.veredicts.datasets[0].data[0] = data[i].total
          else if (data[i].verdict === 'Time Limit Exceeded') this.veredicts.datasets[0].data[1] = data[i].total
          else if (data[i].verdict === 'Runtime Error') this.veredicts.datasets[0].data[2] = data[i].total
          else if (data[i].verdict === 'Compilation Error') this.veredicts.datasets[0].data[3] = data[i].total        
          else if (data[i].verdict === 'Wrong Answer') this.veredicts.datasets[0].data[4] = data[i].total
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

  getStatsByLang() {
    this.syllabusService.loadStatsByLang(this.idAssignment, this.idAssignmentProblem)
      .then (data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].language === 'Java') this.langs.datasets[0].data[0] = data[i].total
          else if (data[i].language === 'C++') this.langs.datasets[0].data[1] = data[i].total
          else if (data[i].language === 'Python') this.langs.datasets[0].data[2] = data[i].total
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

  getSubmissions() {
    let sortValue
    if(this.sort === 'Tiempo de ejecución') sortValue = 'time'
    else sortValue = 'date'
    let veredictValue = this.veredict.value
    if(veredictValue === 'ALL') veredictValue = null
    this.syllabusService.getSubmissionsAssignment(this.idAssignment, this.idAssignmentProblem, this.limit, this.page, (this.by === 'Ascendente' ? 'ASC' : 'DESC'), sortValue, veredictValue)
      .then(data => {
        this.totalPages = data.meta.totalPages
        this.submissions = []
        if(data.meta.totalItems > 0) this.submissions = data.data
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

  showDate(date) {
    let d = new Date(date)
    return this.getDate(d) + ' - ' + this.getTime(d)
  }

  getDate (date) {
    let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return date.getDate() + ' de ' + months[date.getMonth()] + ' del ' + date.getFullYear()
  }

  getTime (date) {
    let tmp = ''
    if (date.getHours() <= 12) tmp += (date.getHours() + ':') 
    else if (date.getHours() > 12) tmp += (date.getHours() - 12) + ':'
    tmp += (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    if(date.getHours() < 12) tmp += 'AM'
    else tmp += 'PM'
    return tmp 
  }

  mapVeredict(veredict) {
    if (veredict === 'in queue') return 'En espera'
    else if (veredict === 'running') return 'Ejecutando'
    else if (veredict === 'Accepted') return 'Correcto'
    else if (veredict === 'Compilation Error') return 'Error de compilación'
    else if (veredict === 'Time Limit Exceeded') return 'Tiempo limite excedido'
    else if (veredict === 'Runtime Error') return 'Error en tiempo de ejecución'
    else if (veredict === 'Wrong Answer') return 'Respuesta equivocada'
  }

  toFixed(value) {
    if(isNaN(parseFloat(value))) return '-'
    return parseFloat(value).toFixed(3)  
  }

  viewCode (submission) {
    this.downloadActive = false
    this.submissionLoaded = submission
    this.submissionLoaded.code = 'Cargando código...'
    window.$('#submission-detail').modal('show')
    this.problemService.getSubmission(this.submissionLoaded.file_name)
      .then(data => {
        this.codeDownload = data
        this.downloadActive = true
        let reader  = new FileReader()
        reader.onload = () => {
          this.submissionLoaded.code = reader.result
        }
        reader.readAsText(data)
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

  downloadCode () {
    let filename
    if(this.submissionLoaded.language === 'Java') filename = 'Main.java'
    else if(this.submissionLoaded.language === 'C++') filename = 'main.cpp'
    else if(this.submissionLoaded.language === 'Python') filename = 'main.py'
    if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(this.codeDownload, filename)
    }
    else{
        let elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(this.codeDownload)
        elem.download = filename  
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
    }
  }
}