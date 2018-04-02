import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { MESSAGES } from 'config/config'
import { Contest } from 'models/models'
import { Alert, Contests } from 'services/services'

/**
 * CreateContest (Module)
 * Módulo encargado de crear maratones de programación
 * @export
 * @class CreateContest
 */
@inject(Alert, Contests, Router)
export class CreateContest {
  /**
   * Inicializa la instancia.
   */
  constructor (alertService, contestService, router) {
    this.alertService = alertService
    this.contestService = contestService
    this.router = router
    this.newContest = new Contest()
    this.startDate = this.formatDate(new Date())
    this.endDate = this.startDate
    this.startTime = this.formatTime(new Date())
    this.endTime = this.startTime
  }

  /**
   * Formatea una fecha dada al formato YYYY-MM-DD
   * @param {Date} date - Fecha a formatear
   * @return {string} fecha formateada
   */
  formatDate (date) {
    let str = date.getUTCFullYear() + '-'
    if (date.getMonth() + 1 < 10) str += '0'
    str += (date.getMonth() + 1) + '-'
    if (date.getDate() < 10) str += '0'
    str += date.getDate()
    return str
  }

  /**
   * Formatea una hora dada al formato YYYY-MM-DD
   * @param {Date} time - Hora a formatear (Aunque se envia una fecha completa, solo se analiza la hora)
   * @return {string} Hora formateada
   */
  formatTime (time) {
    let str = ''
    if (time.getHours() < 10) str += '0'
    str += time.getHours() + ':'
    if (time.getMinutes() < 10) str += '0'
    str += time.getMinutes()
    return str
  }

  /**
   * Crea una nueva maratón en la plataforma.
   */
  create () {
    this.newContest.initDate = new Date(this.startDate + ' ' + this.startTime).toISOString()
    this.newContest.endDate = new Date(this.endDate + ' ' + this.endTime).toISOString()
    this.contestService.createContest(this.newContest)
      .then(data => {
        this.router.navigate('#/maraton/')
        this.alertService.showMessage(MESSAGES.contestCreated)
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
}
