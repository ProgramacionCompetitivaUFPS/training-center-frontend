import { inject, observable } from 'aurelia-framework'
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

// dependencias a inyectar: Servicio de notificaciones (Alert), 
// servicio de autenticación y validación de usuarios (Auth),
// servicio de backend de material (Material)
@inject(Alert, Auth, Materials)

export class PublicMaterial {
  // Elementos observables. 
  @observable page
  @observable filterChange

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
    this.numberOfItems = [4, 8, 12, 16]
    this.sortOptions = ['Id', 'Nombre']
    this.filterChange = true
    this.limit = 8
    this.sort = 'Id'
    this.by = 'Ascendente'
    this.page = 1
    this.totalPages = 1
    this.getMaterial()
  }

  /**
   * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
  filterChangeChanged (act, prev) {
    if(prev !== undefined) this.getMaterial()
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if(prev !== undefined) this.getMaterial()
  }

  /**
   * Obtiene la lista de materiales según los parametros indicados.
   */
  getMaterial () {
    this.materialService.getPublicMaterial(this.page, this.limit, (this.sort === 'Nombre') ? 'name' : undefined, (this.by === 'Ascendente' ? 'asc' : 'desc'))
      .then(data => {
        this.materials = []
        this.totalPages = data.meta.totalPages
        if (this.totalPages !== 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.materials.push(new Material(data.data[i].id, data.data[i].name))
          }
        } else {
          this.alertService.showMessage(MESSAGES.materialsEmpty)
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
