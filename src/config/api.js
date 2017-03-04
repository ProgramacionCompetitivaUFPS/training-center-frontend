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
  apiUrl: 'http://demo9817161.mockable.io/',
  endponts: {
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
