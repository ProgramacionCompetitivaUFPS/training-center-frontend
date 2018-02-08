import { Assignment } from './assignment'
/**
 * Syllabus (Model)
 * Modelo de Syllabus.
 * @export
 * @class Syllabus
 */
export class Syllabus {
  /**
    * Crea una instancia de Problem.
    * @param {number} id - Identificador del syllabus
    * @param {string} title - titulo del syllabus
    * @param {string} description - descripción del syllabus
    * @param {bool} privacy - True si es un syllabus público, false si es privado
    * @param {string} key - opcional, clave para desbloquear el syllabus SOLO si es privado
    * @param {bool} enrolled - true si el usuario está matriculado en el syllabus, false en caso contrario
    * @param {array} assignments - Tareas
    */
  constructor (id = undefined, title = undefined, description = undefined, privacy = true, key = '0000', enrolled = false, assignments = []) {
    this.id = id
    this.title = title
    this.description = description
    this.privacy = privacy
    this.key = key
    this.enrolled = enrolled
    this.assignments = []
    this.mockAssignments(assignments)
  }

  mockAssignments (assignments) {
    for (let i = 0; i < assignments.length; i++) {
      this.assignments.push(new Assignment(assignments[i].tittle, assignments[i].description, assignments[i].init_date, assignments[i].end_date, undefined, this.id, assignments[i].id))
    }
  }
}
