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
   * @param {Number} id - Identificador de la maratón.
   * @param {Number} type - Tipo (0 universidad 1 colegios) .
   */
  constructor (title = undefined, description = undefined, initDate = undefined, endDate = undefined, rules = undefined, privacy = true, key = undefined, id = undefined, type = undefined) {
    this.title = title
    this.description = description
    this.initDate = initDate
    this.endDate = endDate
    this.rules = rules
    this.privacy = privacy
    this.key = key
    this.id = id
    this.type = type
  }

  /**
   * Retorna la fecha de inicio en un formato semántico al usuario.
   */
  getSemanticStartDate () {
    return this.getSemanticDate(new Date(this.initDate))
  }

  /**
   * Retorna la fecha de finalización en un formato semántico al usuario.
   */
  getSemanticEndDate () {
    return this.getSemanticDate(new Date(this.endDate))
  }

  /**
   * Retorna una fecha con un formato semántico.
   * @param {Date} date - Fecha a convertir.
   */
  getSemanticDate (date) {
    let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let hour = ''
    if (date.getHours() === 0) hour = '12:'
    else if (date.getHours() > 12) hour = ((date.getHours() - 12) + ':')
    else hour = (date.getHours()) + ':'
    if (date.getMinutes() < 10) hour += '0'
    hour += date.getMinutes()
    if (date.getHours() >= 12) hour += 'PM'
    else hour += 'AM'
    return date.getDate() + ' ' + ' de ' + months[date.getMonth()] + ' del ' + date.getFullYear() + ' - ' + hour
  }
}
