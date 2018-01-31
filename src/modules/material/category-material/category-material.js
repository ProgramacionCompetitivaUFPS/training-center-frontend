import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Material } from 'models/models'
import { Alert, Auth, Materials } from 'services/services'

/**
 * CategoryMaterial (Module)
 * Módulo encargado de mostrar el material que hace parte de una categoría
 * @export
 * @class CategoryMaterial
 */
export class CategoryMaterial {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * servicio de backend de material (Material), servicio de Router (Router)
   */
  static inject () {
    return [Alert, Auth, Materials, Router]
  }

  /**
   * Crea una instancia de CategoryMaterial.
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
    this.newMaterial = new Material()
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
   * Obtiene la lista de materiales según los parametros indicados.
   */
  getMaterial () {
    this.materialService.getCategoryMaterial(this.id)
      .then(data => {
        console.log(data)
        this.materials = data.materials
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.materialDoesNotExist)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
        this.routerService.navigate('')
      })
  }
}
