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

      var problem = new Problem(
        problems[i].id,
        problems[i].title_en,
        problems[i].title_es,
        problems[i].level,
        null,null,null,null,null,null,null,null,null,null,
        problems[i].user.name,
        problems[i].user.username,null,false,
        problems[i].submissions.length,
        problems[i].approval_rate,
        problems[i].submission_count
      )
      problem.input = problems[i].input
      problem.output = problems[i].output
      this.problemsLoaded.push(problem)
      if (problems[i].submissions.length > 0)
        this.problemsLoaded[i].resolved = true;
    }
  }

  /**
   * Elimina un problema de problemsLoaded.
   * @param {number} id - Identificador del problema a eliminar.
   */
  removeProblem (id) {
    for (let i = 0; i < this.problemsLoaded.length; i++) {
      if (this.problemsLoaded[i].id === id) {
        this.problemsLoaded.splice(i, 1)
        break
      }
    }
  }

}
