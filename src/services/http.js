import { HttpClient } from 'aurelia-fetch-client'
import { CONFIG } from 'config/config'
import 'fetch'

export class Http {

  constructor () {
    this.httpClient = new HttpClient()
    this.httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(CONFIG.apiUrl)
    })
  }
}
