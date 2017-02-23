/**
 * Problem (Model)
 * Modelo de problema.
 * @export
 * @class Problem
 */
export class Problem {
  /**
   * Crea una instancia de Problem.
   * @param {number} [id] - Identificador del problema
   * @param {string} [title] - Título del problema
   * @param {number} [level] - Nivel del problema
   * @param {number} [categoryId] - Identificador de la categoría
   * @param {string} [category] - Nombre de la categoría
   */
  constructor (id = null, title = null, level = null, categoryId = null, category = null) {
    this.id = id
    this.title = title
    this.level = level
    this.categoryId = categoryId
    this.category = category
  }
}
