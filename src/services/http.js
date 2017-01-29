import { HttpClient } from 'aurelia-fetch-client'
import { API } from 'config/api'
import 'fetch'

export class Http {

  constructor () {
    this.httpClient = new HttpClient()
    this.httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(API.apiUrl)
    })
  }

  checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  parseJSON (response) {
    return response.json()
  }

}
