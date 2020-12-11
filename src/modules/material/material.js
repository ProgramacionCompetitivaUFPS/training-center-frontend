export class Material {
    /**
     * Se encarga del enrutamiento dentro de la aplicación
     * @param {any} config - Configuración de la aplicación
     * @param {any} router - Enrutador principal de la aplicación
     */
    configureRouter(config, router) {
        config.map([{
                route: '',
                name: 'material',
                moduleId: PLATFORM.moduleName('modules/material/category-material/category-material'),
                title: 'Material',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            //Materiales para colegios
            {
                route: ['/colegios', '/universidades'],
                name: 'general-materials',
                moduleId: PLATFORM.moduleName('modules/material/general-materials/general-materials'),
                title: 'Training Center - Materiales',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                route: '/material/:id',
                name: 'specificMaterial',
                moduleId: PLATFORM.moduleName('modules/material/specific-material/specific-material'),
                title: 'Material',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            }
        ])
        this.router = router
    }
}