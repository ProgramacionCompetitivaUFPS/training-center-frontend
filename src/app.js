import { Redirect } from 'aurelia-router'
import { Auth, Http } from 'services/services'

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
   * @returns Array con las dependencias a inyectar: Servicio de conexión http (Http)
   */
  static inject () {
    return [Http]
  }
  /**
   * Crea una instancia de App.
   * @param {service} httpService - Servicio de conexión http
   */
  constructor (httpService) {
    this.httpService = httpService
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
      // Home
      {
        name: 'home',
        route: '',
        moduleId: './modules/home/home',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      }
    ])
    this.router = router
  }
}

/**
 * AuthorizeStep
 * Clase encargada de verificar si un usuario tiene permisos para acceder a una ruta
 * @class AuthorizeStep
 */
class AuthorizeStep {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de autenticación (Auth)
   */
  static inject () {
    return [Auth]
  }

  /**
   * Crea una instancia de AuthorizeStep.
   * @param {service} authService - Servicio de autenticación
   */
  constructor (authService) {
    this.authService = authService
  }

  /**
   * Verifica si la instrucción de navegación puede ser ejecutada (es decir, si el usuario tiene permisos)
   * Y la ejecuta. De no tener permisos, redirige a una nueva ruta.
   * @param {any} navigationInstruction - Instrucción de navegación recibida
   * @param {any} next - Enrutamento
   */
  run (navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1) && this.authService.isAdmin()) {
      return next()
    }
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('coach') !== -1) && this.authService.isCoach()) {
      return next()
    }
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('student') !== -1) && this.authService.isStudent()) {
      return next()
    }
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('visitor') !== -1)) {
      if (!this.authService.isVisitor()) {
        return next.cancel(new Redirect(''))
      } else {
        return next()
      }
    }
    if (this.authService.isVisitor()) {
      return next.cancel(new Redirect('iniciar-sesion'))
    } else {
      return next.cancel(new Redirect(''))
    }
  }
}
