/**
 * Syllabus (Model)
 * Modelo de Syllabus.
 * @export
 * @class Syllabus
 */
export class Syllabus {
  /**
    * Crea una instancia de Problem.
    * @param {string} title - titulo del syllabus
    * @param {string} description - descripción del syllabus
    * @param {bool} privacy - True si es un syllabus público, false si es privado
    * @param {string} key - opcional, clave para desbloquear el syllabus SOLO si es privado
    */
  constructor (title = undefined, description = undefined, privacy = true, key = '0000') {
    this.title = title
    this.description = description
    this.privacy = privacy
    this.key = key
  }
}
