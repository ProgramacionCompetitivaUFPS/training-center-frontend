/**
 * Problem (Model)
 * Modelo de problema.
 * @export
 * @class Problem
 */
export class Problem {
  /**
   * Crea una instancia de Problem.
   * @param {number} id - Identificador del problema
   * @param {string} titleEN - Título del problema en ingles
   * @param {string} titleES - Titulo del problema en español
   * @param {number} level - Nivel del problema
   * @param {number} category - Identificador de la categoría
   * @param {string} categoryName - Nombre de la categoría
   * @param {string} descriptionEN - Enunciado del problema en inglés
   * @param {string} descriptionES - Enunciado del problema en español
   * @param {string} exampleIput - Entradas de ejemplo
   * @param {string} exampleOutput - Salidas de ejemplo
   * @param {Number} auxiliarId - Si el problema está en una maratón o syllabus, tiene un id axuxiliar
   * @param {boolean} resolved - True si el problema ha sido previamente solucionado, false en caso contrario 
   */
  constructor (id = undefined, titleEN = undefined, titleES = undefined, level = undefined, category = undefined, categoryName = undefined, descriptionEN = undefined, descriptionES = undefined, exampleInput = undefined, exampleOutput = undefined, timeLimit = undefined, input = undefined, output = undefined, author = undefined, authorName = undefined, auxiliarId = undefined, resolved = false) {
    this.id = id
    this.titleEN = titleEN
    this.titleES = titleES
    this.level = level
    this.category = category
    this.categoryName = categoryName
    this.descriptionEN = descriptionEN
    this.descriptionES = descriptionES
    this.exampleInput = exampleInput
    this.exampleOutput = exampleOutput
    this.timeLimit = timeLimit
    this.input = input
    this.output = output
    this.author = author
    this.authorName = authorName
    this.auxiliarId = auxiliarId
    this.resolved = resolved
  }

  /**
   * Indica si el problema tiene versión en inglés.
   * @return true si el problema está en ingles, false en caso contrario
   */
  isInEnglish () {
    return this.titleEN != null
  }

  /**
   * Indica si el problema tiene versión en español.
   * @return true si el problema está en español, false en caso contrario
   */
  isInSpanish () {
    return this.titleES != null
  }
}
