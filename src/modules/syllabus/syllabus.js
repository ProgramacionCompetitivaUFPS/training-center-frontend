import { MESSAGES } from 'config/config'
import { Alert, Auth, Syllabuses } from 'services/services'

/**
 * Syllabus (Module)
 * Módulo encargado de manejar las clases específicas
 * @export
 * @class Syllabus
 */
export class Syllabus {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de Autenticación (Auth) y Servicio de obtención y manejo de clases (Syllabus)
   */
  static inject () {
    return [Alert, Auth, Syllabuses]
	}
	/**
   * Crea una instancia de GeneralProblems.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} syllabusService - Servicio de obtención y manejo de clases
   */
  constructor (alertService, authService, syllabusService) {
    this.alertService = alertService
    this.authService = authService
    this.syllabusService = syllabusService
    this.page = 1
    this.syllabuses = []
    this.enrolledSyllabuses = []
	}
	
	/**
   * Inicializa la lista de clases para desplegarlas en la vista.
   * Este método se dispara una vez la vista y el view-model son cargados.
   */
  created () {
    if(this.authService.isStudent()) this.getEnrolledSyllabuses()
    this.getSyllabuses()
	}
	
	/**
   * Lee la lista de categorías disponibles en la plataforma (En caso de ser coach, solo los syllabus propios).
   */
  getSyllabuses () {
		let coachId = null
		if(this.authService.isCoach()) coachId = this.authService.getUserId()
    this.syllabusService.getSyllabuses(8, this.page, coachId)
      .then(data => {
        console.log(data)
        this.syllabuses = data.data
        console.log(this.syllabuses)
        if (this.syllabuses.length === 0) {
          this.alertService.showMessage(MESSAGES.syllabusesEmpty)
        }
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
   * Lee la lista de categorías en las cuales está matriculado un estudiante.
   */
  getEnrolledSyllabuses() {
    
  }
}