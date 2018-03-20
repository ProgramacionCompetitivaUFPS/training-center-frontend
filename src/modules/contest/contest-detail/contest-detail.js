import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { MESSAGES } from 'config/config'
import { Contest } from 'models/models'
import { Alert, Auth, Contests } from 'services/services'

@inject(Alert, Auth, Contests, Router)
export class ContestDetail {
  
  /**
   * Inicializa la instancia.
   */
  constructor (alertService, authService, contestService, router) {
    this.alertService = alertService
    this.authService = authService
    this.contestService = contestService
    this.router = router
    this.contest = new Contest()
    this.status = 'unverified'
    this.key = ''
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
    this.getContest()
    this.getStatus()
  }

  /**
   * Obtiene la información de la maratón actual.
   */
  getContest () {
    this.contestService.getContest(this.id)
      .then(data => {
        this.contest = new Contest(data.contest.title, data.contest.description, data.contest.init_date, data.contest.end_date, data.contest.rules, data.contest.public, null, this.id)
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
   * Obtiene el estado actual del estudiante en una maratón.
   */
  getStatus () {
    this.contestService.getStatus(this.id, this.authService.getUserId())
      .then(data => {
        this.status = data.status
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
   * Registra un usuario en la competencia.
   */
  register () {
    this.contestService.enroll(this.id, this.key)
      .then(data => {
        this.alertService.showMessage(MESSAGES.contestRegistered)
        window.$('#register-modal').modal('hide')
        this.status = 'registered'
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestErrorRegister)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#register-modal').modal('hide')
      })
  }

  /**
   * Elimina un usuario en la competencia.
   */
  unregister () {
    this.contestService.unenroll(this.id)
      .then(data => {
        this.alertService.showMessage(MESSAGES.contestUnregistered)
        window.$('#unregister-modal').modal('hide')
        this.status = 'unregistered'
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestErrorRegister)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#unregister-modal').modal('hide')
      })
  }

  /**
   * Muestra un popup para confirmar el registro a una maratón.
   */
  showRegisterModal () {
    window.$('#register-modal').modal('show')
  }

  /**
   * Muestra un popup para confirmar el registro a una maratón.
   */
  showUnregisterModal () {
    window.$('#unregister-modal').modal('show')
  }
}