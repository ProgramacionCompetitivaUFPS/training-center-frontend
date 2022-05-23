import { inject, observable } from 'aurelia-framework'
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

// dependencias a inyectar: Servicio de notificaciones (Alert),
// servicio de autenticación y autorización (Auth),
// servicio de backend de material (Material), servicio de Router (Router)
@inject(Alert, Auth, Materials, Router)

export class CategoryMaterial {

  // Elementos observables. 
  @observable page
  @observable filterChange

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
    this.materials = []
    this.newMaterial = new Material()
    this.numberOfItems = [3, 7, 11, 15]
    this.sortOptions = ['Id', 'Nombre']
    this.filterChange = false
    this.limit = 7
    this.sort = 'Id'
    this.by = 'Ascendente'
    this.page = 1
    this.totalPages = 1
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
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate (params, routeConfig) {
    this.routeConfig = routeConfig
    this.id = params.id
    this.newMaterial.category = this.id
    this.getMaterial()
  }

  /**
   * Obtiene la lista de materiales según los parametros indicados.
   */
  getMaterial () {
    this.materialService.getCategoryMaterial(this.id, this.page, this.limit, (this.sort === 'Nombre') ? 'name' : undefined, (this.by === 'Ascendente' ? 'asc' : 'desc'))
      .then(data => {
        this.materials = []
        this.category = data.meta.categoryName
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

  /**
   * Muestra un popup para confirmar la eliminación del material indicado por id.
   * @param {number} id - Identificador del material a eliminar.
   */
  showRemoveMaterial (id, name) {
    this.materialToRemove = id
    this.materialToRemoveName = name
    window.$('#remove-material').modal('show')
  }

  /**
   * Crea un nuevo material en la plataforma.
   */
  createMaterial () {
    this.materialService.createMaterial(this.newMaterial)
      .then(data => {
        this.alertService.showMessage(MESSAGES.addedMaterial)
        this.getMaterial()
        this.newMaterial = new Material()
        this.newMaterial.category = this.id
        window.$('#new-material').modal('hide')
      }).catch(() => {
        this.alertService.showMessage(MESSAGES.serverError)
        window.$('#new-material').modal('hide')
      })
  }

  /**
   * Crea un nuevo material en la plataforma.
   */
  removeMaterial () {
    this.materialService.remove(this.materialToRemove)
      .then(data => {
        this.alertService.showMessage(MESSAGES.materialRemoved)
        this.getMaterial()
        window.$('#remove-material').modal('hide')
      }).catch(() => {
        this.alertService.showMessage(MESSAGES.serverError)
        window.$('#remove-material').modal('hide')
      })
  }
  tour(){
    introJs().start();
  }
}
