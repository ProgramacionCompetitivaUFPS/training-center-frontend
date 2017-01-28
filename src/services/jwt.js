import { CONFIG } from 'config/config'

export class Jwt {
  constructor () {
    this.token = window.localStorage.getItem(CONFIG.tokenName)
    if (this.tokenExists()) {
      this.data = JSON.parse(window.atob(this.token.split('.')[1]))
    } else {
      this.data = null
    }
  }

  save (token) {
    window.localStorage.setItem(CONFIG.tokenName, JSON.stringify(token))
    this.token = window.localStorage.getItem(CONFIG.tokenName)
    this.data = JSON.parse(window.atob(this.token.split('.')[1]))
  }

  remove () {
    window.localStorage.removeItem(CONFIG.tokenName)
    this.token = null
    this.data = null
  }

  tokenExists () {
    return window.localStorage.getItem(CONFIG.tokenName) !== null
  }

  getUsername () {
    if (!this.tokenExists) {
      return null
    } else {
      return this.data.username
    }
  }

  getUserId () {
    if (!this.tokenExists) {
      return null
    } else {
      return this.data.sub
    }
  }

  getUserType () {
    if (!this.tokenExists()) {
      return 'visitor'
    } else {
      let type = this.data.usertype
      switch (type) {
        case '0':
          return 'student'
        case '1':
          return 'coach'
        case '2':
          return 'admin'
      }
      return 'visitor'
    }
  }
}
