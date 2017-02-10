import { Redirect } from 'aurelia-router'
import { Auth } from 'services/services'
/**
 * AuthorizeStep
 * Clase encargada de verificar si un usuario tiene permisos para acceder a una ruta
 * @class AuthorizeStep
 */
export class AuthorizeStep {
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
