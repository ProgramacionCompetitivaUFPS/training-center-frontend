import { HttpClient } from 'aurelia-fetch-client'

import { API } from 'config/api'
import 'fetch'

/**
 * Http (Service)
 * Servicio encargado de las conexiones http utilizando el estandar Fetch
 * @export
 * @class Http
 */
export class Http {
  /**
   * Crea una instancia de Http, y configura el cliente de conexión.
   */
  constructor () {
    this.httpClient = new HttpClient()
    this.httpClient.configure(config => {
      config
        .withBaseUrl(API.apiUrl)
    })
  }

  /**
   * Verifica el status code de las respuestas recibidas en las conexiones, y dispara
   * un error en casos de status code erroneos. Importante: Los errores deben ser capturados
   * con un catch
   * @param {response} response - Respuesta recibida, generalmente en JSON
   * @returns cuerpo de la respuesta
   * @throws errores en la comunicación que retornen codigos diferentes a 2xx
   */
  checkStatus (response) {
    if (response.ok) {
      return response
    } else {
      let error = new Error(response.statusText)
      error.status = response.status
      error.response = response.clone()
      return Promise.reject(error)
    }
  }

  /**
   * Parsea la respuesta a formato json
   * @param {response} response - Respuesta a la petición
   * @returns JSON - Objeto JSON con la respuesta recibida
   */
  parseJSON (response) {
    return response.json()
  }

  /**
   * Parsea la respuesta a formato compatible blob
   * @param {response} response - Respuesta a la petición
   * @returns BLOB - Objeto blob con la respuesta recibida
   */
  parseBlob (response) {
    return response.blob()
  }
}
