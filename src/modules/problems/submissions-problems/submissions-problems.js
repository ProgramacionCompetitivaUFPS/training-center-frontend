import { inject, observable } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Category, Problem } from 'models/models'
import { Alert, Auth, Problems } from 'services/services'

/**
 * SubmissionsProblems (Module)
 * Módulo encargado de mostrar los problemas que hacen parte de una categoría
 * @export
 * @class SubmissionsProblems
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de autenticación (Auth), Servicio de problemas (Problems), 
// servicio de Router (Router)
@inject(Alert, Auth, Problems, Router)
export class SubmissionsProblems {
   // Elementos observables. 
   @observable page
   @observable filterChange

   /**
    * Crea una instancia de CategoryProblems.
    * @param {service} alertService - Servicio de notificaciones
    * @param {service} authService - Servicio de autenticación y validación
    * @param {service} problemService - Servicio manejador de problemas
    * @param {service} routerService - Servicio de enrutamiento
    */
   constructor(alertService, authService, problemService, routerService) {
       this.alertService = alertService
       this.authService = authService
       this.problemsService = problemService
       this.routerService = routerService
       this.totalPages = 1
       this.page = 1
       this.numberOfItems = [10, 20, 30, 50]
       this.sortOptions = ['Id', 'Veredicto', 'Usuario','Lenguaje']
       this.filterChange = false
       this.limit = 10
       this.sort = 'Id'
       this.by = 'Ascendente'
       this.pagination = []
       this.language = 'Cualquier idioma'
       this.title=""
   }

   viewCode(submission) {
    this.downloadActive = false
    this.submissionLoaded = submission
    console.log(submission,"XXXX")
    this.submissionLoaded.code = 'Cargando código...'
    window.$('#submission-detail').modal('show')
    this.problemService.getSubmission(this.submissionLoaded.file_name)
      .then(data => {
        this.codeDownload = data
        this.downloadActive = true
        let reader  = new FileReader()
        reader.onload = () => {
          if(submission.blockly_file_name !== undefined && submission.blockly_file_name !== null){
            this.downloadMesagge = 'Descargar código (Python)' 
            this.isABlocklyCode = true
            this.viewSvgSubmission(submission)
          }else{
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

   /**
    * Método que toma los parametros enviados en el link y configura la página para adaptarse
    * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
    * ejecuta automáticamente luego de lanzar el constructor.
    * @param {any} params
    * @param {any} routeConfig
    */
   activate(params, routeConfig) {
       this.routeConfig = routeConfig
       this.id = params.id
       this.getProblems()
   }

   /**
    * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
    * @param {bool} act - Nuevo estado 
    * @param {bool} prev - Antiguo estado
    */
   filterChangeChanged(act, prev) {
       if (prev !== undefined) this.getProblems()
   }

   /**
    * Detecta cuando el número de página es modificado para solicitar el nuevo número.
    * @param {Number} act - Número de página nuevo.
    * @param {Number} prev - Número de página antes del cambio
    */
   pageChanged(act, prev) {
       if (prev !== undefined) this.getProblems()
   }    
   /**
   * Retorna una fecha con un formato semántico.
   * @param {Date} date - Fecha a convertir.
   */
  getSemanticDate (date) {
    let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let hour = ''
    date = new Date(date)
    if (date.getHours() === 0) hour = '12:'
    else if (date.getHours() > 12) hour = ((date.getHours() - 12) + ':')
    else hour = (date.getHours()) + ':'
    if (date.getMinutes() < 10) hour += '0'
    hour += date.getMinutes()
    if (date.getHours() >= 12) hour += 'PM'
    else hour += 'AM'
    return date.getDate() + ' ' + ' de ' + months[date.getMonth()] + ' del ' + date.getFullYear() + ' - ' + hour
  }
   /**
    * Obtiene la lista de problemas según los parametros indicados.
    */
   getProblems() {
       let stringSort, stringLang
       if (this.sort === 'Id') stringSort = null
       else if (this.sort === 'Veredicto') stringSort = 'verdict'
       else if (this.sort === 'Usuario') stringSort = 'name'
       else if (this.sort === 'Lenguaje') stringSort = 'language'
       if (this.language === 'Español') stringLang = 'es'
       else if (this.language === 'Inglés') stringLang = 'en'
       this.problemsService.getSubmissions(this.id, this.page, this.limit, stringSort, (this.by === 'Ascendente' ? 'asc' : 'desc'), stringLang)
            .then(data => {
                this.title=data.meta.title
                this.totalPages = data.meta.totalPages
                if (this.totalPages !== 0) {
                    this.submissions = data.data
                } else {
                    this.alertService.showMessage(MESSAGES.problemsSubmissionsEmpty)
                }
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.categoryDoesNotExist)
                    this.routerService.navigate('')
                }
            })
   }

}