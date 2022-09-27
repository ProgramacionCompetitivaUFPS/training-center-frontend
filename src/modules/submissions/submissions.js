import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Material, Enums } from 'models/models'
import { Alert, Auth, Problems, Rankings } from 'services/services'

/**
 * Submissions (Module)
 * Módulo encargado de ver los envios en la plataforma.
 * @export
 * @class Submissions
 */

// dependencias a inyectar: Servicio de notificaciones (Alert), 
// servicio de autenticación y validación de usuarios (Auth)
@inject(Alert, Auth, Problems, Rankings)
export class Submissions {
  // Elementos observables. 
  @observable page
  @observable filterChange

  /**
   * Inicializa una instancia de Admin.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {material} materialService - Servicio de material
   */
  constructor (alertService, authService, problemService, rankingService) {
    this.alertService = alertService
    this.problemService = problemService
    this.authService = authService
    this.rankingService = rankingService
    this.numberOfItems = [10, 15, 20]
    this.sortOptions = ['Fecha', 'Dificultad', 'Tiempo de ejecución']
    this.filterChange = false
    this.submissions = []
    this.limit = 10
    this.sort = 'Fecha'
    this.by = 'Descendente'
    this.page = 1
    this.downloadActive = false
    this.totalPages = 1
    this.isABlocklyCode = false
    this.veredictOptions = [
      {value : 'ALL', text : 'Cualquier veredicto'},
      {value : 'ACC', text : 'Correcto'},
      {value : 'TL', text : 'Tiempo límite excedido'},
      {value : 'WA', text : 'Respuesta incorrecta'},
      {value : 'RT', text : 'Error en tiempo de ejecución'},
      {value : 'CE', text : 'Error de compilación'}
    ]
    this.veredict = this.veredictOptions[0]
    this.downloadMesagge = 'Descargar código'
    this.enums = Enums
    this.getSubmissions()
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
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if(prev !== undefined) this.getSubmissions()
  }

  getSubmissions() {
    let sortValue
    if(this.sort === 'Tiempo de ejecución') sortValue = 'time'
    else if(this.sort === 'Dificultad') sortValue = 'level'
    else sortValue = 'date'
    let veredictValue = this.veredict.value
    if(veredictValue === 'ALL') veredictValue = null
    this.rankingService.getSubmissions(this.authService.getUserId(), this.limit, this.page, (this.by === 'Ascendente' ? 'ASC' : 'DESC'), sortValue, veredictValue)
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
          console.log(submission)
          if(submission.blockly_file_name !== undefined && submission.blockly_file_name !== null){
            console.log("es blocklyyyy submission")
            this.downloadMesagge = 'Descargar código (Python)' 
            this.isABlocklyCode = true
            this.viewSvgSubmission(submission)
          }else{
            console.log("NO es blocklyyyy submission")
            this.downloadMesagge = 'Descargar código'
            this.isABlocklyCode = false
            this.submissionLoaded.code = reader.result
          }
          
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

  viewSvgSubmission(submission){
    this.problemService.getSvgSubmission(this.submissionLoaded.blockly_file_name)
      .then(data => {
        this.submissionLoaded.svgUrl = URL.createObjectURL(data)
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
    else filename = 'main.py'

    if(this.isABlocklyCode){
      //this.codeDownload = sessionStorage.getItem('pythonCode')
      console.log("descarga de submission en blockly", this.codeDownload)
    }
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
