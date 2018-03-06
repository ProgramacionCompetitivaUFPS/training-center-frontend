/**
 * Contest (Module)
 * Módulo encargado de manejar las maratones de programación
 * @export
 * @class Contest
 */
export class Syllabus {
  /**
   * Se encarga del enrutamiento dentro de la aplicación
   * @param {any} config - Configuración de la aplicación
   * @param {any} router - Enrutador principal de la aplicación
   */
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.map([
      {
        route: '',
        name: 'contest',
        moduleId: 'modules/contest/home-contest/home-contest',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: 'nueva',
        name: 'create',
        moduleId: 'modules/contest/create-contest/create-contest',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      }
    ])
    this.router = router
  }
}
