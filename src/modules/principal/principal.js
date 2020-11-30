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
                moduleId: 'modules/principal/principal-index/principal-index',
                title: 'Training center Principal',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'high-school',
                route: 'colegios',
                moduleId: 'modules/principal/principal-high-school/principal-high-school',
                title: 'Training center High School - Principal',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            }
        ])
        this.router = router
    }
}