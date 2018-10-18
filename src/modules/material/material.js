export class Material {
  /**
 * Se encarga del enrutamiento dentro de la aplicación
 * @param {any} config - Configuración de la aplicación
 * @param {any} router - Enrutador principal de la aplicación
 */
  configureRouter (config, router) {
    config.map([
      {
        route: '',
        name: 'material',
        moduleId: 'modules/material/category-material/category-material',
        title: 'Material',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      },
      {
        route: '/material/:id',
        name: 'specificMaterial',
        moduleId: 'modules/material/specific-material/specific-material',
        title: 'Material',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      }
    ])
    this.router = router
  }
}
