import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Material, UserSignIn } from 'models/models'
import { Alert, Auth, Materials } from 'services/services'

/**
 * Admin (Module)
 * Módulo encargado de la administración de la plataforma.
 * @export
 * @class Admin
 */

// dependencias a inyectar: Servicio de notificaciones (Alert), 
// servicio de autenticación y validación de usuarios (Auth),
// servicio de backend de material (Material)
@inject(Alert, Auth, Materials)
export class Admin {
  // Elementos observables. 
  @observable page
  @observable filterChange

  /**
   * Inicializa una instancia de Admin.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {material} materialService - Servicio de material
   */
  constructor (alertService, authService, materialService) {
    this.alertService = alertService
    this.authService = authService
    this.materialService = materialService
    this.newUser = new UserSignIn()
    this.newUser.type = 1
    this.numberOfItems = [10, 15, 20]
    this.sortOptions = ['Id', 'Nombre']
    this.filterChange = false
    this.limit = 10
    this.sort = 'Id'
    this.by = 'Ascendente'
    this.page = 1
    this.totalPages = 1
    this.getMaterials()
  }

  /**
   * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
  filterChangeChanged (act, prev) {
    if(prev !== undefined) this.getMaterials()
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if(prev !== undefined) this.getMaterials()
  }

  /**
   * Obtiene los materiales pendientes de aprobación.
   */
  getMaterials () {
    this.materialService.getPendingMaterial(this.page, this.limit, (this.sort === 'Nombre') ? 'name' : undefined, (this.by === 'Ascendente' ? 'asc' : 'desc'))
      .then(data => {
        this.materials = []
        this.totalPages = data.meta.totalPages
        if (this.totalPages !== 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.materials.push(new Material(data.data[i].id, data.data[i].name, data.data[i].category_id, undefined, undefined, data.data[i].url, undefined, data.data[i].category.name))
          }
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
   * Crea un nuevo usuario docente o administrador en la plataforma.
   */
  createUser () {
    if (!this.newUser.isValid()) {
      this.alertService.showMessage(MESSAGES.superUserWrongData)
    } else if (this.newUser.username.length < 6 || this.newUser.username.length > 30) {
      this.alertService.showMessage(MESSAGES.usernameInvalid)
    } else if (this.newUser.password !== this.newUser.confirmPassword) {
      this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
    } else {
      this.authService.createSuperUser(this.newUser)
      .then(() => {
        this.alertService.showMessage(MESSAGES.superUserCreated)
      }).catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.superUserWrongData)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
      })
    }
  }

  /**
   * Aprueba un material en la plataforma.
   * @param {Number} id - Identificador del material.
   */
  approveMaterial (id) {
    this.materialService.approve(id)
      .then(() => {
        this.alertService.showMessage(MESSAGES.materialApproved)
        this.getMaterials()
      }).catch(() => {
        this.alertService.showMessage(MESSAGES.serverError)
      })
  }

  /**
   * Muestra un popup para confirmar la eliminación del material indicado por id.
   * @param {number} id - Identificador del material a eliminar.
   */
  showRemoveMaterial (id) {
    this.materialToRemove = id
    window.$('#remove-material').modal('show')
  }

  /**
   * Elimina un material que no ha sido aprobado.
   */
  removeMaterial () {
    this.materialService.remove(this.materialToRemove)
      .then(() => {
        this.alertService.showMessage(MESSAGES.materialDeleted)
        this.getMaterials()
        window.$('#remove-material').modal('hide')
      }).catch(() => {
        this.alertService.showMessage(MESSAGES.serverError)
        window.$('#remove-material').modal('hide')
      })
  }
}
