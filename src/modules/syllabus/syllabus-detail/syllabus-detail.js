import { inject, observable } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { MESSAGES } from 'config/config'
import { Material, Syllabus } from 'models/models'
import { Alert, Auth, Syllabuses } from 'services/services'

/**
 * SyllabusDetail (Module)
 * Módulo encargado de manejar el detalle de un syllabus
 * @export
 * @class SyllabusDetail
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth) y Servicio de obtención y manejo de clases (Syllabus)
@inject(Alert, Auth, Syllabuses, Router)
export class SyllabusDetail {
  // Elementos observables. 
  @observable page
  /**
   * Crea una instancia de SyllabusDetail.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} syllabusService - Servicio de obtención y manejo de clases
   */
  constructor (alertService, authService, syllabusService, router) {
    this.alertService = alertService
    this.authService = authService
    this.syllabusService = syllabusService
    this.router = router
    this.syllabus = new Syllabus()
    this.newMaterials = ''
    this.materials = []
    this.page = 1
    this.totalPages = 1
    this.users = []
  }
   /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageChanged (act, prev) {
    if (prev !== undefined) this.getUsers()
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
    this.getSyllabus()
    this.getMaterials()
    this.getUsers()
  }

  /**
   * Lee los detalles del syllabus en la plataforma.
   */
  getSyllabus () {
    this.syllabusService.getSyllabus(this.id)
      .then(data => {
        this.syllabus = new Syllabus(data.syllabus.id, data.syllabus.tittle, data.syllabus.description, data.syllabus.public, undefined, true, data.syllabus.assignments)
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Obtiene los materiales del syllabus desde la plataforma.
   */
  getMaterials () {
    this.syllabusService.loadMaterials(this.id)
      .then(data => {
        this.materials = []
        for (let i = 0; i < data.syllabus.materials.length; i++) {
          this.materials.push(new Material(data.syllabus.materials[i].id, data.syllabus.materials[i].name, data.syllabus.materials[i].category_id, data.syllabus.materials[i].description, undefined, data.syllabus.materials[i].url, undefined, undefined))
        }

      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Valida si la cadena de ids separados por comas es válida. 
   * @return true si es válida, false si no
   */
  validateMaterialsIds () {
    let materialsTemp = this.newMaterials.replace(/ /g, '')
    materialsTemp = materialsTemp.split(',')
    let materialsArr = []
    for (let i = 0; i < materialsTemp.length; i++) {
      if (materialsTemp[i].length > 0 && !isNaN(parseInt(materialsTemp[i]))) materialsArr.push(parseInt(materialsTemp[i]))
      else if (isNaN(parseInt(materialsTemp[i]))) return false
    }
    this.newMaterials = materialsArr
    return true
  }

  /**
   * Añade materiales a la plataforma.
   */
  addMaterials () {
    if (this.validateMaterialsIds()) {
      this.syllabusService.addMaterials(this.id, this.newMaterials)
        .then(() => {
          this.newMaterials = ''
          this.getSyllabus()  
        })
        .catch(error => {
          this.newMaterials = ''
          if (error.status === 401) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    } else {
      this.alertService.showMessage(MESSAGES.invalidIdMaterial)
    }
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
   * Elimina un material de la plataforma.
   */
  removeMaterial () {
    this.syllabusService.removeMaterial(this.id, this.materialToRemove)
      .then(() => {
        this.alertService.showMessage(MESSAGES.materialDeleted)
        this.getMaterials()
        window.$('#remove-material').modal('hide')
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#remove-problem').modal('hide')
      })
  }

  /**
   * Muestra un popup para confirmar la desuscripción del usuario.
   */
  showModalExit () {
    window.$('#remove-user').modal('show')
  }

  /**
   * Desmatricula a un usuario de su clase.
   */
  removeUser() {
    this.syllabusService.removeUser(this.id)
      .then(() => {
        this.alertService.showMessage(MESSAGES.syllabusUnenroll)
        window.$('#remove-user').modal('hide')
        this.router.navigate('/clases')
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#remove-user').modal('hide')
      })
  }

  /**
   * Obtiene los usuarios de la clase.
   */
  getUsers() {
    this.syllabusService.getStatistics(this.id, 15, this.page)
      .then(data => {
        this.totalPages = data.meta.totalPages
        this.users = []
        if(this.totalPages > 0) this.users = data.data
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.unknownError)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
      })
  }

  /**
   * Muestra un popup para confirmar la desuscripción del usuario.
   */
  showModalRemove (id) {
    this.userToRemove = id
    window.$('#remove-user-coach').modal('show')
  }

  /**
   * Elimina a un usuario por parte del coach
   */
  removeUserFromCoach() {
    this.syllabusService.removeUserFromCoach(this.id, this.userToRemove)
      .then(() => {
        this.alertService.showMessage(MESSAGES.userDeletedSyllabus)
        window.$('#remove-user-coach').modal('hide')
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
        window.$('#remove-user-coach').modal('hide')
      })
  }
}
