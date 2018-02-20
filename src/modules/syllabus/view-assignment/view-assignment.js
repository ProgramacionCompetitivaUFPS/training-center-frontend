import { MESSAGES } from 'config/config'
import { Assignment } from 'models/models'
import { Alert, Auth, Syllabuses } from 'services/services'
/**
 * ViewAssignment (Module)
 * Módulo encargado de desplegar tareas
 * @export
 * @class ViewAssignment
 */
export class ViewAssignment {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de autenticación de usuarios (Auth), Servicio de obtención y edición de
   * Syllabus (Syllabus)
   */
  static inject () {
    return [Alert, Auth, Syllabuses]
  }

  /**
   * Inicializa una instancia de ViewAssignment
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} syllabusService - Servicio de obtención y manejo de clases
   */
  constructor (alertService, authService, syllabusService) {
    this.alertService = alertService
    this.authService = authService
    this.syllabusService = syllabusService
    this.assignment = new Assignment()
    this.sortDisplay = 'Id'
    this.byDisplay = 'Ascendente'
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
    this.getAssignment()
  }

  /**
   * Obtiene la tarea
   */
  getAssignment () {
    this.syllabusService.loadAssignment(this.id)
      .then(data => {
        this.assignment = new Assignment(data.assignment.tittle, data.assignment.description, data.assignment.init_date, data.assignment.end_date, undefined, undefined, this.id)
        this.assignment.adjuntProblems(data.assignment.problems)
      })
      .catch(error => {
        console.log(error)
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Establece un nuevo criterio de ordenamiento.
   * @param {string} value - Criterio de ordenamiento.
   */
  setSort (value) {
    this.sortDisplay = value
    this.sortProblems()
  }

  /**
   * Establece una nueva dirección de ordenamiento.
   * @param {string} value - Dirección de ordenamiento.
   */
  setBy (value) {
    this.byDisplay = value
    this.sortProblems()
  }

  /**
  * Ordena los problemas según el criterio establecido.
  */
  sortProblems () {
    if (this.sortDisplay === 'Id' && this.byDisplay === 'Ascendente') this.assignment.problemsLoaded.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    else if (this.sortDisplay === 'Id' && this.byDisplay === 'Descendente') this.assignment.problemsLoaded.sort((a, b) => parseInt(b.id) - parseInt(a.id))
    else if (this.sortDisplay === 'Dificultad' && this.byDisplay === 'Ascendente') this.assignment.problemsLoaded.sort((a, b) => parseInt(a.level) - parseInt(b.level))
    else if (this.sortDisplay === 'Dificultad' && this.byDisplay === 'Descendente') this.assignment.problemsLoaded.sort((a, b) => parseInt(b.level) - parseInt(a.level))
  }
}
