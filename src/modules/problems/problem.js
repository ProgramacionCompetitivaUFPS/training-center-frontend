export class Problem {

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
        name: 'problems',
        moduleId: 'modules/problems/general-problems/general-problems',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      },
      {
        name: 'category',
        route: 'categoria/:id',
        moduleId: 'modules/problems/category-problems/category-problems',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      },
      {
        name: 'problems-creator',
        route: 'nuevo',
        moduleId: 'modules/problems/problems-creator/problems-creator',
        settings: {
          roles: ['admin', 'coach']
        }
      }
    ])
    this.router = router
  }
}
