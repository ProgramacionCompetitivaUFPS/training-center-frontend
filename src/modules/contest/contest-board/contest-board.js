import { inject, observable } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { API, MESSAGES } from 'config/config'
import { Contest } from 'models/models'
import { Alert, Auth, Contests } from 'services/services'

import io from 'socket.io-client'

@inject(Alert, Auth, Contests, Router)
export class ContestBoard {
  @observable now
  @observable dateLoaded
  @observable problemsLoaded
  
  /**
   * Inicializa la instancia.
   */
  constructor (alertService, authService, contestService, router) {
    this.alertService = alertService
    this.authService = authService
    this.contestService = contestService
    this.router = router
    this.contest = new Contest()
    this.flagProblems = false
    this.mapProblems = []
    this.startDate
    this.reverseMapProblems = []
    this.totalProblems = 0
    this.status = 'unverified'
    this.score = []
    this.creatorId = 0
    this.key = ''
    this.contTime = {}
    this.now
    this.dateLoaded
    this.problemsLoaded = false
  }

  dateLoadedChanged (act, prev) {
    if(act && this.problemsLoaded) this.verifyShow() 
  }

  problemsLoadedChanged (act, prev) {
    if(act && this.dateLoaded) this.verifyShow() 
  }

  verifyShow() {
    if (this.now < this.startDate) {
      this.router.navigate('#/maraton/' + this.id)
      this.alertService.showMessage(MESSAGES.contestNotStarted)
    } else {
      this.flagProblems = true
      if (!this.contest.privacy && this.authService.getUserId() !== this.creatorId) this.getStatus()
      else this.getScore()
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
    this.id = params.id
    this.getProblems()
  }

  deactivate () {
    try {
      this.socketContest.close()
    } catch(error) {}
    
  }

  /**
   * Obtiene el estado actual del estudiante en una maratón.
   */
  getStatus () {
    this.contestService.getStatus(this.id, this.authService.getUserId())
      .then(data => {
        this.status = data.status
        if(this.status !== 'registered' && !this.contest.privacy) {
          this.router.navigate('#/maraton/' + this.id)
          this.alertService.showMessage(MESSAGES.contestBoardNotRegistered)
        } else this.getScore()
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  sortScore () {
    this.score.sort(function (a, b) {
      if (a.total < b.total) return 1
      else if (a.total > b.total) return -1
      else {
        if (a.penalization > b.penalization) return 1
        else if (a.penalization < b.penalization) return -1
      }
      return 0
    })
    this.defineGold()
  }

  defineGold() {
    let minG =  99999999, minI = -1, minU = -1
    for (let i = 0; i < this.totalProblems; i++) {
      let minT = 99999999, minJ = -1
      for(let j = 0; j < this.totalRegistered; j++) {
        if(this.score[j].results[i].second != -1) {
          if(this.score[j].results[i].second <= minT) {
            minT = this.score[j].results[i].second
            minJ = j
            if(this.score[j].results[i].second <= minG) {
              minG = this.score[j].results[i].second
              minI = j
              minU = i
            }
          }
        }
      }
      if(minJ != -1) this.score[minJ].results[i].third = 1
    }
    if(minI != -1 )this.score[minI].results[minU].third = 2

  }

  getScore () {
    this.contestService.getScore(this.id)
      .then(data => {
        this.totalRegistered = data.length
        for (let i = 0; i < data.length; i++) {
          this.score.push(new Object())
          this.score[i].name = data[i].name
          this.score[i].username = data[i].username
          this.score[i].id = data[i].id
          this.score[i].results = []
          for (let j = 0; j < this.totalProblems; j++) {
            this.score[i].results.push(new Object())
          }
          for (let j = 0; j < this.totalProblems; j++) {
            if (data[i].problems[this.reverseMapProblems[j]] === undefined) {
              this.score[i].results[j].first = -1
              this.score[i].results[j].second = -1
              this.score[i].results[j].third = 0
            } else if (data[i].problems[this.reverseMapProblems[j]].accepted){
              this.score[i].results[j].first = data[i].problems[this.reverseMapProblems[j]].errors + 1
              this.score[i].results[j].second = data[i].problems[this.reverseMapProblems[j]].min_accepted
              this.score[i].results[j].third = 0
            } else {
              this.score[i].results[j].first = data[i].problems[this.reverseMapProblems[j]].errors
              this.score[i].results[j].second = -1
              this.score[i].results[j].third = 0
            }
          }
          this.score[i].total = data[i].total_accepted
          this.score[i].penalization = data[i].total_time
        }
        this.sortScore()
        this.socketContest = io.connect(API.apiUrl + 'contest')
          this.socketContest.on('new submission', (data) => {
            let submissionTime = new Date(data.created_at)
            if (this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].second == -1) {
              let tmp = this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].first 
              this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].first = 1 + Math.max(0, tmp)
              if (data.verdict === 'Accepted') {
                this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].second = parseInt(Math.abs(submissionTime.getTime() - this.startDate.getTime()) / 60000)
                this.score[this.getUserPosition(data.user_id)].total++
                this.score[this.getUserPosition(data.user_id)].penalization += this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].second + ((this.score[this.getUserPosition(data.user_id)].results[this.mapProblems[data.problem_id]].first - 1) * 20)
                this.sortScore()
              }
            }
          })
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          //this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  getUserPosition (id) {
    for (let i = 0; i < this.score.length; i++) {
      if (this.score[i].id == id) return i
    }
  }

  getProblems() {
    this.contestService.getProblemsContest(this.id)
      .then(data => {
        this.contest = new Contest(data.contest.title, data.contest.description, data.contest.init_date, data.contest.end_date, data.contest.rules, data.contest.public, null, this.id)
        this.startDate = new Date(data.contest.init_date)
        this.endDate = new Date(data.contest.end_date)
        this.creatorId = data.contest.user_id
        this.problemsLoaded = true
        this.totalProblems = data.contest.problems.length
        for(let i = 0; i < data.contest.problems.length; i++) {
          this.mapProblems[data.contest.problems[i].id] = i;
          this.reverseMapProblems[i] = data.contest.problems[i].contests_problems.id
        }
      })
      .catch(error => {
        console.log(error)
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }
  letterValue (index) {
    return String.fromCharCode(index + 65)
  }
}