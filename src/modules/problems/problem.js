export class Problem {
    /**
     * Se encarga del enrutamiento dentro de la aplicación
     * @param {any} config - Configuración de la aplicación
     * @param {any} router - Enrutador principal de la aplicación
     */
    configureRouter(config, router) {
        config.map([{
                route: 'colegios',
                name: 'problems-high-school',
                moduleId: PLATFORM.moduleName('modules/problems/general-problems-high-school/general-problems-high-school'),
                title: 'Problemas Training Center High School',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: "submissions-problems",
                route: ":id/envios",
                moduleId: PLATFORM.moduleName("modules/problems/submissions-problems/submissions-problems"),
                title: "Envios de un problema",
                settings: {
                    roles: ["coach", "admin"]
                }
            },
            {
                route: '',
                name: 'problems-universities',
                moduleId: PLATFORM.moduleName('modules/problems/general-problems-universities/general-problems-universities'),
                title: 'Problemas Training Center',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'category',
                route: 'categoria/:id',
                moduleId: PLATFORM.moduleName('modules/problems/category-problems/category-problems'),
                title: 'Problemas',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'schools_category',
                route: 'colegios/categoria/:id',
                moduleId: PLATFORM.moduleName('modules/problems/category-problems-schools/category-problems-schools'),
                title: 'Problemas - Colegios',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'problems-creator',
                route: 'nuevo',
                moduleId: PLATFORM.moduleName('modules/problems/problems-creator/problems-creator'),
                title: 'Nuevo problema',
                settings: {
                    roles: ['admin', 'coach']
                }
            },
            {
                name: 'edit-problem',
                route: ':id/editar',
                moduleId: PLATFORM.moduleName('modules/problems/problems-creator/problems-editor'),
                title: 'Editar problema',
                settings: {
                    roles: ['admin', 'coach']
                }
            },
            {
                name: 'view-problem',
                route: [':id/detalle', ':id/detalle/:lang'],
                moduleId: PLATFORM.moduleName('modules/problems/view-problem/view-problem'),
                title: 'Problema',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
            {
                name: 'schools-view-problem',
                route: ['colegios/:id/detalle', 'colegios/:id/detalle/:lang'],
                moduleId: PLATFORM.moduleName('modules/problems/schools-view-problem/schools-view-problem'),
                title: 'Problema - Colegios',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            },
        ])
        this.router = router
    }
}