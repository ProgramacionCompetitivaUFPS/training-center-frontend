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
  configureRouter (config, router) {
    config.map([
      {
        route: '',
        name: 'contest',
        moduleId: 'modules/contest/home-contest/home-contest',
        title: 'Maratones',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: 'nueva',
        name: 'create',
        moduleId: 'modules/contest/create-contest/create-contest',
        title: 'Nueva maratón',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: 'editar/:id',
        name: 'edit',
        moduleId: 'modules/contest/edit-contest/edit-contest',
        title: 'Editar maratón',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: ':id/',
        name: 'detail',
        moduleId: 'modules/contest/contest-detail/contest-detail',
        title: 'Maratón',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: ':id/resultados',
        name: 'board',
        moduleId: 'modules/contest/contest-board/contest-board',
        title: 'Tablero de resultados',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: ':id/problemas',
        name: 'problems',
        moduleId: 'modules/contest/contest-problems/contest-problems',
        title: 'Problemas',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      },
      {
        route: [':id/problema/:problemId/:contestProblemId', ':id/problema/:problemId/:contestProblemId/:lang'],
        name: 'problem',
        moduleId: 'modules/contest/contest-problem/contest-problem',
        title: 'Problema',
        settings: {
          roles: ['coach', 'student', 'admin']
        }
      }
    ])
    this.router = router
  }
}
