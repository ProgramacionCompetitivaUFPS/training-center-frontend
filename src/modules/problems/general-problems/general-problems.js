import { MESSAGES } from 'config/config'
import { Alert, Problems } from 'services/services'

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
   * Servicio de obtención y manejo de problemas (Problems)
   */
  static inject () {
    return [Alert, Problems]
  }

  /**
   * Crea una instancia de GeneralProblems.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de obtención y manejo de problemas
   */
  constructor (alertService, problemsService) {
    this.alertService = alertService
    this.problemsService = problemsService
    this.categories = []
  }

  /**
   * Inicializa la lista de categorías para desplegarlas en la vista.
   * Este método se dispara una vez la vista y el view-model son cargados.
   */
  created () {
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

}
