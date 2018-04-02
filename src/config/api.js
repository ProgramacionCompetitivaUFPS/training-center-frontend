/**
 * API
 * Archivo con todos los datos para la conexión al backend
 * @exports API - Objeto JSON con datos de conexión a Backend
 */
export let API = {
  // API

  /**
   * apiUrl debe reemplazarse por la dirección del backend
   */
  apiUrl: 'http://ufpstrainingcenter.com:3000/',
  endpoints: {
    auth: 'auth',
    users: 'users',
    user: 'user',
    superUser: 'super-user',
    recovery: 'recovery',
    reset: 'reset',
    categories: 'categories',
    categoryProblems: 'categories/{1}/problems',
    materials: 'materials',
    problems: 'problems',
    syllabus: 'syllabus',
    enrolledSyllabus: 'users/{1}/syllabus',
    assignments: 'assignments',
    assignment: 'assignment',
    addProblemAssignment: 'add-problems',
    addMaterials: 'add-materials',
    removeProblemAssignment: 'remove-problems',
    removeMaterialSyllabus: 'remove-materials',
    ranking: 'ranking',
    contests: 'contests',
    submissions: 'submissions'
  },

  // SESSION
  tokenName: 'Authorization'
}
