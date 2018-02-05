import { Auth, Http } from 'services/services'
import { AuthorizeStep } from './authorize-step'

/**
 * App (Main Module)
 * Módulo central de la aplicación
 * @export
 * @class App
 */
export class App {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de autenticación (Auth),
   * Servicio de conexión http (Http)
   */
  static inject () {
    return [Auth, Http]
  }
  /**
   * Crea una instancia de App.
   * @param {service} authService - Servicio de Autenticación
   * @param {service} httpService - Servicio de conexión http
   */
  constructor (authService, httpService) {
    this.httpService = httpService
    this.authService = authService
  }
  /**
   * Se encarga del enrutamiento dentro de la aplicación
   * @param {any} config - Configuración de la aplicación
   * @param {any} router - Enrutador principal de la aplicación
   */
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      {
        route: '',
        redirect: 'problemas'
      },
      // Login
      {
        name: 'login',
        route: 'iniciar-sesion',
        moduleId: './modules/login/login',
        title: 'Iniciar Sesión',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Signin
      {
        name: 'signin',
        route: 'registro',
        moduleId: './modules/signin/signin',
        title: 'Regístrate',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Recovery Password
      {
        name: 'recovery-password',
        route: 'recuperar-password',
        moduleId: './modules/recovery/recovery-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Reset Password
      {
        name: 'reset-password',
        route: 'cambiar-password/:token',
        moduleId: './modules/recovery/reset-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Problems
      {
        name: 'problems',
        route: 'problemas',
        moduleId: './modules/problems/problem',
        layoutView: './layouts/logged.html',
        nav: true,
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      },
      // Ranking
      {
        name: 'ranking',
        route: 'ranking',
        moduleId: './modules/home/home',
        layoutView: './layouts/logged.html',
        nav: true,
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      },
      // Clases
      {
        name: 'classes',
        route: 'clases',
        moduleId: './modules/syllabus/syllabus',
        layoutView: './layouts/logged.html',
        nav: true,
        settings: {
          roles: ['coach', 'student']
        }
      },
      {
        name: 'material',
        route: ['materials', 'materials/:id'],
        moduleId: './modules/material/material',
        layoutView: './layouts/logged.html',
        nav: true,
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      }
    ])
    this.router = router
  }
}
