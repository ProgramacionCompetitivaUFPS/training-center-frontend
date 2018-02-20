import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Material } from 'models/models'
import { Alert, Auth, Materials } from 'services/services'

/**
 * PublicMaterial (Module)
 * Módulo encargado de mostrar el material de forma pública.
 * @export
 * @class PublicMaterial
 */
export class PublicMaterial {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * servicio de backend de material (Material)
   */
  static inject () {
    return [Alert, Auth, Materials]
  }

  /**
   * Crea una instancia de CategoryMaterial.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {material} materialService - Servicio de material
   */
  constructor (alertService, authService, materialService) {
    this.alertService = alertService
    this.authService = authService
    this.materialService = materialService
    this.materials = []
    this.getMaterial()
  }

  /**
   * Obtiene la lista de materiales según los parametros indicados.
   */
  getMaterial () {
    this.materialService.getPublicMaterial()
      .then(data => {
        for(let i = 0; i < data.materials.length; i++) {
          this.materials.push(new Material(data.materials[i].id, data.materials[i].name))
        }
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.materialDoesNotExist)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
      })
  }
}
