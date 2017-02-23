import { Problem } from './problem'

/**
 * Category (Model)
 * Modelo de datos de una categoría
 */
export class Category {
  /**
  * Crea una instancia de Category.
  * @param {string} [name] - Nombre de la categoría
  */
  constructor (name) {
    this.name = name
    this.totalProblems = 0
    this.problemsLoaded = []
  }

  /**
   * Modifica el total de problemas de la categoría (No necesariamente estarán cargados)
   * @param {number} [totalProblems] - Número total de problemas en la categoría
   */
  setTotalProblems (totalProblems) {
    this.totalProblems = totalProblems
  }

  /**
   * Actualiza la lista de problemas mostrados en la categoría
   * @param {string} [problems] - Array JSON con los problemas
   */
  setProblemsLoaded (problems) {
    this.problemsLoaded = []
    for (let i = 0; i < problems.length; i++) {
      this.problemsLoaded.push(new Problem(problems[i].id, problems[i].name, problems[i].level))
    }
  }

}
