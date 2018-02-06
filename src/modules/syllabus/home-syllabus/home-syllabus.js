import { MESSAGES } from 'config/config'
import { Syllabus } from 'models/models'
import { Alert, Auth, Syllabuses } from 'services/services'

/**
 * HomeSyllabus (Module)
 * Módulo encargado de manejar las clases específicas
 * @export
 * @class HomeSyllabus
 */
export class HomeSyllabus {
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
    this.syllabusesLoaded = true
    this.enrolledSyllabusesLoaded = true
    this.newSyllabus = new Syllabus()
    this.editSyllabus = new Syllabus()
    this.syllabusToRemove = new Syllabus()
    this.syllabusToEnroll = new Syllabus()
    this.options = [true, false]
  }

  /**
   * Inicializa la lista de clases para desplegarlas en la vista.
   * Este método se dispara una vez la vista y el view-model son cargados.
   */
  created () {
    this.getSyllabuses()
  }

  /**
   * Lee la lista de categorías disponibles en la plataforma (En caso de ser coach, solo los syllabus propios).
   */
  getSyllabuses () {
    let coachId = null
    if (this.authService.isCoach()) coachId = this.authService.getUserId()
    this.syllabusService.getSyllabuses(8, this.page, coachId)
      .then(data => {
        this.syllabuses = data.data
        console.log(this.syllabuses)
        if (this.syllabuses.length === 0) {
          this.syllabusesLoaded = false
        }
        if (this.authService.isStudent()) this.getEnrolledSyllabuses()
      })
      .catch(error => {
        this.syllabusesLoaded = false
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
  getEnrolledSyllabuses () {
    this.enrolledSyllabuses = []
    this.syllabusService.getEnrolledSyllabuses()
      .then(data => {
        for (let i = 0; i < data.user.syllabuses.length; i++) {
          for (let j = 0; j < this.syllabuses.length; j++) {
            if (this.syllabuses[j].id === data.user.syllabuses[i]) {
              this.enrolledSyllabuses.push(this.syllabuses[j])
              this.syllabuses[j].enrolled = true
            }
          }
        }
        if (this.enrolledSyllabuses.length === 0) {
          this.enrolledSyllabusesLoaded = false
        }
      })
      .catch(error => {
        console.log(error)
        this.enrolledSyllabusesLoaded = false
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Crea un nuevo syllabus en la plataforma
   */
  createSyllabus () {
    if (!this.newSyllabus.privacy && (this.newSyllabus.key === null || this.newSyllabus.key === undefined || this.newSyllabus.key === '')) {
      this.alertService.showMessage(MESSAGES.syllabusKeyNeeded)
    }
    this.syllabusService.registerSyllabus(this.newSyllabus)
      .then((data) => {
        this.getSyllabuses()
        this.alertService.showMessage(MESSAGES.syllabusCreated)
        window.$('#new-syllabus').modal('hide')
        this.newSyllabus = new Syllabus()
      })
      .catch(() => {
        this.alertService.showMessage(MESSAGES.unknownError)
        window.$('#new-syllabus').modal('hide')
      })
  }

  /**
   * Despliega en pantalla el menú de editar Syllabus
   * @param {number} id - Id del Syllabus a editar
   * @param {string} title - Título del syllabus a editar
   * @param {string} description - Descripción del syllabus a editar
   * @param {bool} privacy - True si el syllabus es público, false en caso contrario
   */
  showEditSyllabus (id, title, description, privacy) {
    this.editSyllabus = new Syllabus(id, title, description, privacy, '')
    window.$('#edit-syllabus').modal('show')
  }

  /**
   * Envia al servidor los datos de un syllabus para ser editado.
   */
  modifySyllabus () {
    if (!this.editSyllabus.privacy && (this.editSyllabus.key === null || this.editSyllabus.key === undefined || this.editSyllabus.key === '')) {
      this.alertService.showMessage(MESSAGES.syllabusKeyNeeded)
    } else {
      this.syllabusService.editSyllabus(this.editSyllabus)
        .then(() => {
          this.syllabuses.find(i => i.id === this.editSyllabus.id).tittle = this.editSyllabus.title
          this.alertService.showMessage(MESSAGES.syllabusEdited)
          window.$('#edit-syllabus').modal('hide')
        })
        .catch(error => {
          if (error.status === 401 || error.status === 403) {
            this.alertService.showMessage(MESSAGES.permissionsError)
          } else if (error.status === 500) {
            this.alertService.showMessage(MESSAGES.serverError)
          } else {
            this.alertService.showMessage(MESSAGES.unknownError)
          }
          window.$('#edit-syllabus').modal('hide')
        })
    }
  }

  /**
   * Muestra en pantalla el popup para eliminar un syllabus.
   * @param {number} id - Identificador del syllabus a eliminar.
   * @param {string} name - Nombre del syllabus.
   */
  showRemoveSyllabus (id, name) {
    this.syllabusToRemove = new Syllabus(id, name)
    window.$('#remove-syllabus').modal('show')
  }

  /**
   * Elimina el syllabus seleccionado
   */
  removeSyllabus () {
    this.syllabusService.removeSyllabus(this.syllabusToRemove.id)
    .then(() => {
      this.syllabuses.splice(this.syllabuses.findIndex(i => i.id === this.syllabusToRemove.id), 1)
      this.alertService.showMessage(MESSAGES.syllabusRemoved)
      window.$('#remove-syllabus').modal('hide')
    })
    .catch(error => {
      if (error.status === 401 || error.status === 403) {
        this.alertService.showMessage(MESSAGES.permissionsError)
      } else if (error.status === 500) {
        this.alertService.showMessage(MESSAGES.serverError)
      } else {
        this.alertService.showMessage(MESSAGES.unknownError)
      }
      window.$('#remove-syllabys').modal('hide')
    })
  }

  /**
   * Muestra en pantalla el popup para registrarse en un syllabus.
   * @param {number} id - Identificador del syllabus a registrarse.
   * @param {string} name - Nombre del syllabus.
   * @param {string} description - Descripción del Syllabus
   * @param {bool} privacy - true si es público, false en caso contrario
   */
  showEnrollSyllabus (id, name, description, privacy) {
    this.syllabusToEnroll = new Syllabus(id, name, description, privacy, '')
    window.$('#enroll-syllabus').modal('show')
  }

  /**
   * Matricular estudiante en un syllabus
   */
  enrollSyllabus () {
    if (this.syllabusToEnroll.privacy) this.syllabusToEnroll.key = undefined
    if (!this.syllabusToEnroll.privacy && (this.syllabusToEnroll.key === null || this.syllabusToEnroll.key === undefined || this.editSyllabus.key === '')) {
      this.alertService.showMessage(MESSAGES.syllabusKeyNeeded)
    } else {
      this.syllabusService.enrollSyllabus(this.syllabusToEnroll.id, this.syllabusToEnroll.key)
        .then((data) => {
          console.log(data)
          this.alertService.showMessage(MESSAGES.enrolledInSyllabus)
          this.getSyllabuses()
          this.getEnrolledSyllabuses()
          window.$('#enroll-syllabus').modal('hide')
        })
        .catch((error) => {
          console.log(error)
          this.alertService.showMessage(MESSAGES.unknownError)
          window.$('#enroll-syllabus').modal('hide')
        })
    }
  }
}
