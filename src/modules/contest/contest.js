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
    configureRouter(config, router) {
        config.map([{
                route: '',
                name: 'contest',
                moduleId: PLATFORM.moduleName('modules/contest/home-contest/home-contest'),
                title: 'Maratones',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: 'nueva',
                name: 'create',
                moduleId: PLATFORM.moduleName('modules/contest/create-contest/create-contest'),
                title: 'Nueva maratón',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: 'editar/:id',
                name: 'edit',
                moduleId: PLATFORM.moduleName('modules/contest/edit-contest/edit-contest'),
                title: 'Editar maratón',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: ':id/',
                name: 'detail',
                moduleId: PLATFORM.moduleName('modules/contest/contest-detail/contest-detail'),
                title: 'Maratón',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: ':id/resultados',
                name: 'board',
                moduleId: PLATFORM.moduleName('modules/contest/contest-board/contest-board'),
                title: 'Tablero de resultados',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: ':id/problemas',
                name: 'problems',
                moduleId: PLATFORM.moduleName('modules/contest/contest-problems/contest-problems'),
                title: 'Problemas',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {//EN ESTE MOMENTO ESTOY AGREGANDO RESOLVER CON BLOCKLY EN LAS MARATONES
                route: [':id/colegios/problema/:problemId/:contestProblemId', ':id/colegios/problema/:problemId/:contestProblemId/:lang'],
                name: 'problem',
                moduleId: PLATFORM.moduleName('modules/contest/contest-problem/contest-problem'),
                title: 'Problema',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: [':id/problema/:problemId/:contestProblemId', ':id/problema/:problemId/:contestProblemId/:lang'],
                name: 'problem',
                moduleId: PLATFORM.moduleName('modules/contest/contest-school-problem/contest-school-problem'),
                title: 'Problema - Colegios',
                settings: {
                    roles: ['coach', 'student', 'admin']
                }
            },
            {
                route: ['listaenvios/:cid/:usrid'],
                name: 'listaenvios',
                moduleId: PLATFORM.moduleName('modules/contest/contest-listsubmissions/contest-listsubmissions'),
                title: 'Problemas Enviados',
                settings: {
                    roles: ['coach', 'admin']
                }
            }
        ])
        this.router = router
    }
}