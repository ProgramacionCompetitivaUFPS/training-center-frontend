/**
 * Assignment (Model)
 * Modelo de tareas.
 * @export
 * @class Assignment
 */
export class Assignment {
  /**
   * Inicializa una tarea
   * @param {string} title - Nombre de la tarea
   * @param {string} description - Descripción de la tarea
   * @param {stringdate} startDate - Fecha de apertura de la tarea
   * @param {stringdate} endDate - Fecha de cierre de la tarea
   * @param {array} problems - Array con el id de los problemas de la tarea
   * @param {number} syllabusId - Identificador del syllabus al que pertenece la tarea
   */
  constructor (title, description, startDate, endDate, problems, syllabusId) {
    this.title = title
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.problems = problems
    this.syllabusId = syllabusId
  }
}
