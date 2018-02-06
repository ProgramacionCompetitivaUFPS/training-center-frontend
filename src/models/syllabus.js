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
    */
  constructor (id = undefined, title = undefined, description = undefined, privacy = true, key = '0000', enrolled = false) {
    this.id = id
    this.title = title
    this.description = description
    this.privacy = privacy
    this.key = key
    this.enrolled = enrolled
  }
}
