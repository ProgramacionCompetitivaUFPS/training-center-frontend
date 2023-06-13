import { inject } from "aurelia-framework";

import { Router } from "aurelia-router";
import { MESSAGES, SETTINGS, API } from "config/config";
import { Problem } from "models/models";
import { Alert, Auth, Problems, Rankings } from "services/services";

/**
 * Submissions (Module)
 * Módulo encargado de ver los envios en la plataforma.
 * @export
 * @class Submissions
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// servicio de autenticación y validación de usuarios (Auth)
@inject(Alert, Auth, Problems, Rankings)
export class ContestListsubmissions {
  constructor(alertService, authService, problemService, rankingService) {
    this.message = "Hello world";
    this.alertService = alertService;
    this.problemService = problemService;
    this.authService = authService;
    this.rankingService = rankingService;
    this.submissions = [];
    this.downloadActive = false
  }

  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.cid = params.cid;
    this.usrid = params.usrid;
    this.getSubmissionsbyContest();
  }

  getSubmissionsbyContest() {
    this.rankingService.getSubmissionsByContest(this.cid, this.usrid)
      .then((data) => {
        this.submissions = data.datos;
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
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

    this.viewLogs()
    this.showLogs(0)
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

  viewLogs() {
    this.logsMessagge = 'No hay mensajes para mostrar'
    let errorExtension = ''
    if (this.submissionLoaded.verdict == 'Compilation Error') errorExtension = '.out'
    else if (this.submissionLoaded.verdict == 'Runtime Error') errorExtension = '.err'
    if (errorExtension == '') return

    this.problemService.getSubmissionLog(this.submissionLoaded.file_name.split('.')[0] + errorExtension)
      .then(data => {
        let reader = new FileReader()
        reader.onload = () => {
          if (reader.result != undefined)
            this.logsMessagge = reader.result
        }
        reader.readAsText(data)
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403)
          this.alertService.showMessage(MESSAGES.permissionsError)
        else if (error.status === 500)
          this.alertService.showMessage(MESSAGES.serverError)
        else
          this.alertService.showMessage(MESSAGES.unknownError)
      })
  }
  showLogs(bit) {
    document.getElementById("logs-detail").textContent = this.logsMessagge;
    document.getElementById("code-detail").style.display = bit ? "none" : "block"
    document.getElementById("view-logs-btn").style.display = bit ? "none" : "block"
    document.getElementById("view-code-btn").style.display = bit ? "block" : "none"
    document.getElementById("code-download-btn").style.display = bit ? "none" : "block"
    document.getElementById("log-detail").style.display = bit ? "block" : "none"
  }
}
