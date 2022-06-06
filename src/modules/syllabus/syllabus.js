/**
 * Syllabus (Module)
 * Módulo encargado de manejar las clases específicas
 * @export
 * @class Syllabus
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
                name: 'syllabus',
                moduleId: PLATFORM.moduleName('modules/syllabus/home-syllabus/home-syllabus'),
                title: 'Clases',
                settings: {
                    roles: ['coach', 'student']
                }
            },
            {
                route: 'colegios',
                name: 'syllabus-schools',
                moduleId: PLATFORM.moduleName('modules/syllabus/syllabus-schools/syllabus-schools'),
                title: 'Clases Training Center High School',
                settings: {
                    roles: ['coach', 'student']
                }
            },
            {
                name: 'SyllabusDetail',
                route: 'clases/:id',
                moduleId: PLATFORM.moduleName('modules/syllabus/syllabus-detail/syllabus-detail'),
                title: 'Clase',
                settings: {
                    roles: ['coach', 'student']
                }
            },
            {
                name: 'SyllabusStatistics',
                route: 'clases/:id/estadisticas',
                moduleId: PLATFORM.moduleName('modules/syllabus/syllabus-statistics/syllabus-statistics'),
                title: 'Estadísticas de la clase',
                settings: {
                    roles: ['coach']
                }
            },
            {
                name: 'CreateAssignment',
                route: 'nueva-tarea/:id',
                moduleId: PLATFORM.moduleName('modules/syllabus/create-assignment/create-assignment'),
                title: 'Nueva tarea',
                settings: {
                    roles: ['coach']
                }
            },
            {
                name: 'EditAssignment',
                route: 'editar-tarea/:id',
                moduleId: PLATFORM.moduleName('modules/syllabus/create-assignment/edit-assignment'),
                title: 'Editar tarea',
                settings: {
                    roles: ['coach']
                }
            },
            {
                name: 'StatsAssignment',
                route: 'estadisticas/:id',
                moduleId: PLATFORM.moduleName('modules/syllabus/assignment-stats/assignment-stats'),
                title: 'Estadísticas de la tarea',
                settings: {
                    roles: ['coach']
                }
            },
            {
                name: 'AssignmentDetail',
                route: 'estadisticas/:idAssignment/problema/:idAssignmentProblem/:idProblem',
                moduleId: PLATFORM.moduleName('modules/syllabus/assignment-detail/assignment-detail'),
                title: 'Tarea',
                settings: {
                    roles: ['coach']
                }
            },
            {
                name: 'ViewAssignment',
                route: 'tarea/:id',
                moduleId: PLATFORM.moduleName('modules/syllabus/view-assignment/view-assignment'),
                title: 'Tarea',
                settings: {
                    roles: ['student']
                }
            },
            {
                name: 'ViewProblem',
                route: ['tarea/:assignmentId/problema/:problemId/:assignmentProblemId', 'tarea/:assignmentId/problema/:problemId/:assignmentProblemId/:lang'],
                moduleId: PLATFORM.moduleName('modules/syllabus/view-problem/view-problem'),
                title: 'Problema',
                settings: {
                    roles: ['student']
                }
            }
        ])
        this.router = router
    }
}