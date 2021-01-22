export class Principal {
    /**
     * Se encarga del enrutamiento dentro de la aplicación
     * @param {any} config - Configuración de la aplicación
     * @param {any} router - Enrutador principal de la aplicación
     */
    configureRouter(config, router) {
        config.map([{
                route: '',
                name: 'principal-index',
                moduleId: PLATFORM.moduleName('modules/principal/principal-index/principal-index'),
                title: 'Training center Principal',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'high-school',
                route: 'colegios',
                moduleId: PLATFORM.moduleName('modules/principal/principal-high-school/principal-high-school'),
                title: 'Training center High School - Principal',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'transicion',
                route: 'transicion',
                moduleId: PLATFORM.moduleName('modules/principal/principal-high-school/transicion'),
                title: 'Training center High School - Aquí vamos',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            }
        ])
        this.router = router
    }
}