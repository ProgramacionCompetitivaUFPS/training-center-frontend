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
  apiUrl: 'https://ufps-training-center.herokuapp.com/',
  endpoints: {
    auth: 'auth',
    users: 'users',
    recovery: 'recovery',
    reset: 'reset',
    categories: 'categories',
    categoryProblems: 'categories/{1}/problems',
    problems: 'problems'
  },

  // SESSION
  tokenName: 'Authorization'
}
