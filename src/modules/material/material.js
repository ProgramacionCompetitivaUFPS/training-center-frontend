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
            {
                route: '/material/:id',
                name: 'specificMaterial',
                moduleId: PLATFORM.moduleName('modules/material/specific-material/specific-material'),
                title: 'Material',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            //Categorías colegios
            {
                route: ['/colegios/categorias'],
                name: 'categories-high-school',
                moduleId: PLATFORM.moduleName('modules/material/categories-high-school/categories-high-school'),
                title: 'Training Center High School- Categorías',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            //Materiales de cada categoría para colegios
            {
                route: ['/colegios/categorias/categoria/:id'],
                name: 'category-material-high-school',
                moduleId: PLATFORM.moduleName('modules/material/category-material-high-school/category-material-high-school'),
                title: 'Training Center High School- Materiales de estudio',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
        ])
        this.router = router
    }
}