/**
 * Contest (Model)
 * Modelo de maratón.
 * @export
 * @class Contest
 */
export class Contest {
  /**
   * Inicializa una maratón
   * @param {String} title - Título de la competencia
   * @param {String} description - Descripción de la competencia
   * @param {String} initDate - Fecha de inicio en formato 'YYYY-MM-DD HH:MM:SS'
   * @param {String} endDate - Fecha de finalización en formato 'YYYY-MM-DD HH:MM:SS'
   * @param {String} rules - Reglas de la competencia (Definidas por el creador)
   * @param {Bool} privacy - True si es público, false si es privado
   * @param {String} key - Clave de la competencia en caso de ser privada.
   */
  constructor (title = undefined, description = undefined, initDate = undefined, endDate = undefined, rules = undefined, privacy = true, key = undefined) {
    this.title = title
    this.description = description
    this.initDate = initDate
    this.endDate = endDate
    this.rules = rules
    this.privacy = privacy
    this.key = key
  }
}
