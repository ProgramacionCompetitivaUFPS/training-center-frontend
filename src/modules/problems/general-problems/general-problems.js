import { MESSAGES } from 'config/config'
import { Alert, Auth, Problems } from 'services/services'

/**
 * GeneralProblems (Module)
 * Módulo encargado de la vista principal de las categorías, maratones y problemas
 * @export
 * @class GeneralProblems
 */
export class GeneralProblems {

  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de Autenticación (Auth) y Servicio de obtención y manejo de problemas (Problems)
   */
  static inject () {
    return [Alert, Auth, Problems]
  }

  /**
   * Crea una instancia de GeneralProblems.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} problemService - Servicio de obtención y manejo de problemas
   */
  constructor (alertService, authService, problemsService) {
    this.alertService = alertService
    this.authService = authService
    this.problemsService = problemsService
    this.categories = []
    this.newCategory = ''
    this.categoryEditId = null
    this.categoryEditName = ''
    this.categoryRemoveId = null
    this.categoryRemoveName = ''
  }

  /**
   * Inicializa la lista de categorías para desplegarlas en la vista.
   * Este método se dispara una vez la vista y el view-model son cargados.
   */
  created () {
    this.getCategories()
  }

  /**
   * Activa los tooltips y crea los editores según corresponda.
   * Este método hace parte del ciclo de vida de la aplicación y se ejecuta en el instante
   * en que se conecta el componente con el view-model.
   */
  attached () {
    window.$(document).ready(function () {
      window.$('body').tooltip({ selector: '[data-toggle=tooltip]' })
    })
  }

  /**
   * Crea una nueva categoría en la plataforma
   */
  createCategory () {
    this.problemsService.createCategory(this.newCategory)
      .then(() => {
        this.getCategories()
        this.alertService.showMessage(MESSAGES.categoryCreated)
        window.$('#new-category').modal('hide')
      })
      .catch(() => {
        this.alertService.showMessage(MESSAGES.unknownError)
        window.$('#new-category').modal('hide')
      })
  }

  /**
   * Lee la lista de categorías disponibles en la plataforma.
   */
  getCategories () {
    this.problemsService.getCategories()
      .then(data => {
        this.categories = data
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.categoriesError)
        }
      })
  }

  /**
   * Muestra en pantalla el popup para editar el nombre de una categoría.
   * @param {number} id - Identificador de la categoría a editar.
   * @param {string} name - Nombre actual de la categoría.
   */
  showEditCategory (id, name) {
    this.categoryEditId = id
    this.categoryEditName = name
    window.$('#edit-category').modal('show')
  }

  /**
   * Muestra en pantalla el popup para eliminar una categoría.
   * @param {number} id - Identificador de la categoría a eliminar.
   * @param {string} name - Nombre de la categoría.
   */
  showRemoveCategory (id, name) {
    this.categoryRemoveId = id
    this.categoryRemoveName = name
    window.$('#remove-category').modal('show')
  }

  /**
   * Envia al servidor el nuevo nombre de una categoría para ser editado.
   */
  editCategory () {
    this.problemsService.editCategory(this.categoryEditId, this.categoryEditName)
      .then(() => {
        this.categories.find(i => i.id === this.categoryEditId).name = this.categoryEditName
        this.alertService.showMessage(MESSAGES.categoryEdited)
        window.$('#edit-category').modal('hide')
      })
      .catch(() => {
        this.alertService.showMessage(MESSAGES.unknownError)
        window.$('#edit-category').modal('hide')
      })
  }

  /**
   * Envia al servidor la categoría que debe ser eliminada.
   */
  removeCategory () {
    this.problemsService.removeCategory(this.categoryRemoveId)
      .then(() => {
        this.categories.splice(this.categories.findIndex(i => i.id === this.categoryRemoveId), 1)
        this.alertService.showMessage(MESSAGES.categoryRemoved)
        window.$('#remove-category').modal('hide')
      })
      .catch(() => {
        this.alertService.showMessage(MESSAGES.unknownError)
        window.$('#remove-category').modal('hide')
      })
  }
}
