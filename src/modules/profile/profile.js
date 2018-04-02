import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { UserSignIn } from 'models/models'
import { Alert, Auth, Rankings } from 'services/services'

@inject(Alert, Auth, Rankings)
export class Profile {

  /**
   * Inicializa el ranking
   */
  constructor(alertService, authService, rankingService) {
    this.alertService = alertService
    this.rankingService = rankingService
    this.authService = authService
    this.user = new UserSignIn()
    this.date = new Date()
    this.oldPassword = ''
    this.newPassword = ''
    this.retypePassword = ''
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
    if (this.authService.isCoach() || this.authService.isStudent()) {
      this.getStatsByVerdict()
      this.getStatsByLang()
    }
    this.getProfile()
  }

  getProfile() {
    this.rankingService.loadProfile(this.authService.getUserId())
      .then(data => {
        this.user = new UserSignIn(data.email, null, null, data.name, data.username, data.code, null, data.id)
        this.date = new Date(data.created_at)
        if (this.user.code === null) this.user.code = 'No registrado'
      })
      .catch(error => {
        this.user = new UserSignIn()
        this.date = new Date()
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }


  getDate() {
    let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return this.date.getDate() + ' de ' + months[this.date.getMonth()] + ' del ' + this.date.getFullYear()
  }

  getStatsByVerdict() {
    this.rankingService.loadStatsByVerdict(this.authService.getUserId())
      .then(data => {
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
    this.rankingService.loadStatsByLang(this.authService.getUserId())
      .then(data => {
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

  showEditProfile() {
    window.$('#edit-profile').modal('show')
  }
  showEditPassword() {
    window.$('#edit-password').modal('show')
  }

  editPassword() {
    if (this.newPassword !== this.retypePassword) {
      this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
      window.$('#edit-password').modal('hide')
    } else {
      this.authService.setPassword(this.authService.getUserId(), this.oldPassword, this.newPassword, this.retypePassword)
        .then(data => {
          window.$('#edit-password').modal('hide')
          this.oldPassword = ''
          this.newPassword = ''
          this.retypePassword = ''
          this.alertService.showMessage(MESSAGES.passwordUpdated)
        })
        .catch(error => {
          if (error.status === 401) {
            this.alertService.showMessage(MESSAGES.incorrectPassword)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
          window.$('#edit-password').modal('hide')
        })
    }
  }

  editProfile() {
    this.authService.editProfile(this.authService.getUserId(), this.user.email, this.user.username, this.user.name, this.user.code)
      .then(data => {
        window.$('#edit-profile').modal('hide')
        this.alertService.showMessage(MESSAGES.profileUpdated)
        this.user.email = data.email
        this.user.username = data.username
        this.user.name = data.name
        this.user.code = data.code
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#edit-profile').modal('hide')
      })
  }
}
