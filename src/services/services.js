/**
 * Archivo para centralizar los servicios.
 * Cuando se desee importar cualquier servicio, puede hacerlo
 * a través de este archivo: from 'services/services'
 * @exports Alert (Service) - Servicio de notificaciones
 * @exports Auth (Service) - Servicio de autenticación y validación
 * @exports Contests (Service) - Servicio de maratones de programación
 * @exports Date (Service) - servicio de obtención de hora
 * @exports Http (Service) - Servicio de conexión http
 * @exports Jwt (Service) - Servicio de manejo de JSON Web Token (JWT)
 * @exports Materials (Service) - Servicio de manejo de materiales
 * @exports Problems (Service) - Servicio para el manejo de problemas y categorías
 * @exports Ranking (Service) - Servicio para la obtención del ranking
 * @exports Syllabuses (Service) - Servicio para el manejo de syllabus
 * @exports Institutions (Service) - Servicio para el manejo de institutions (universities = 0 and colleges = 1)
 * @exports Categories (Service) - Servicio para la obtención del categorías
 */
export * from './alert'
export * from './auth'
export * from './contests'
export * from './date'
export * from './http'
export * from './jwt'
export * from './materials'
export * from './problems'
export * from './rankings'
export * from './syllabuses'
export * from './institutions'
export * from './categories'