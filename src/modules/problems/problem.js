export class Problem {
    /**
     * Se encarga del enrutamiento dentro de la aplicación
     * @param {any} config - Configuración de la aplicación
     * @param {any} router - Enrutador principal de la aplicación
     */
    configureRouter(config, router) {
        config.map([{
                route: '', //tc or tchs
                name: 'problems',
                moduleId: PLATFORM.moduleName('modules/problems/general-problems/general-problems'),
                title: 'Problemas',
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
                name: 'code-solutions',
                route: [':id/crear-solucion'],
                moduleId: PLATFORM.moduleName('modules/problems/code-solutions/code-solutions'),
                title: 'Crea tu solución',
                settings: {
                    roles: ['admin', 'coach', 'student']
                }
            }
        ])
        this.router = router
    }
}