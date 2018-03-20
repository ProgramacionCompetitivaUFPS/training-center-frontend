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
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.map([
      {
        route: '',
        name: 'syllabus',
        moduleId: 'modules/syllabus/home-syllabus/home-syllabus',
        settings: {
          roles: ['coach', 'student']
        }
      },
      {
        name: 'SyllabusDetail',
        route: 'clases/:id',
        moduleId: 'modules/syllabus/syllabus-detail/syllabus-detail',
        settings: {
          roles: ['coach', 'student']
        }
      },
      {
        name: 'SyllabusStatistics',
        route: 'clases/:id/estadisticas',
        moduleId: 'modules/syllabus/syllabus-statistics/syllabus-statistics',
        settings: {
          roles: ['coach']
        }
      },
      {
        name: 'CreateAssignment',
        route: 'nueva-tarea/:id',
        moduleId: 'modules/syllabus/create-assignment/create-assignment',
        settings: {
          roles: ['coach']
        }
      },
      {
        name: 'EditAssignment',
        route: 'editar-tarea/:id',
        moduleId: 'modules/syllabus/create-assignment/edit-assignment',
        settings: {
          roles: ['coach']
        }
      },
      {
        name: 'ViewAssignment',
        route: 'tarea/:id',
        moduleId: 'modules/syllabus/view-assignment/view-assignment',
        settings: {
          roles: ['student']
        }
      },
      {
        name: 'ViewProblem',
        route: ['tarea/:id/problema/:problemId', 'tarea/:id/problema/:problemId/:lang'],
        moduleId: 'modules/syllabus/view-problem/view-problem',
        settings: {
          roles: ['student']
        }
      }
    ])
    this.router = router
  }
}
