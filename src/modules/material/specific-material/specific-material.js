import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { API, MESSAGES } from 'config/config'
import { Material } from 'models/models'
import { Alert, Auth, Materials } from 'services/services'

/**
 * SpecificMaterial (Module)
 * Módulo encargado de mostrar un material específico
 * @export
 * @class SpecificMaterial
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// servicio de autenticación y autorización (Auth),
// servicio de backend de material (Material), servicio de Router (Router)
@inject(Alert, Auth, Materials, Router)
export class SpecificMaterial {

  /**
   * Crea una instancia de SpecificMaterial.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {material} materialService - Servicio de material
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, materialService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.materialService = materialService
    this.routerService = routerService
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
    this.getMaterial()
  }

  /**
   * Obtiene el material especifico indicado.
   */
  getMaterial () {
    this.materialService.getMaterial(this.id)
      .then(data => {
        let tmp = data.material
        this.category = data.material.category
        if(tmp.url.search('youtube.com') !== -1) tmp.url =  tmp.url.replace('watch?v=', 'embed/')
        if(tmp.url.search('youtu.be') !== -1) tmp.url = tmp.url.replace('youtu.be/', 'youtube.com/embed/')
        if(tmp.url.search('/usr/src/app/files/materials/') !== -1) tmp.url = API.apiUrl + 'materials/pdf/' + tmp.url.replace('/usr/src/app/files/materials/', '')
        this.material = new Material(tmp.id, tmp.name, tmp.number, tmp.description, undefined, tmp.url)
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.materialDoesNotExist)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
        this.routerService.navigate('')
      })
  }
  tour(){
    introJs().start();
  }
}
