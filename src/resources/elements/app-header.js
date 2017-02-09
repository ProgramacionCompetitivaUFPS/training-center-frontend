import { Router } from 'aurelia-router'
import { Auth } from 'services/services'

/**
 * AppHeader (Element)
 * Clase que genera un navbar para los usuarios autenticados.
 * @export
 * @class AppHeader
 */
export class AppHeader {
  /**
   * Método que realiza inyección de las dependencias necesarias en el elemento.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de Autenticación (Auth), 
   * Enrutamiento (Router)
   */
  static inject () {
    return [Auth, Router]
  }

  /**
   * Crea una instancia de AppHeader.
   * @param {service} authService - Servicio de autenticación
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (authService, routerService) {
    this.authService = authService
    this.routerService = routerService
    // Banderas para validar el botón activo en el navbar
    this.problems = routerService.navigation.find(i => i.config.name.indexOf('problems') !== -1)
    this.ranking = routerService.navigation.find(i => i.config.name.indexOf('ranking') !== -1)
    this.classes = routerService.navigation.find(i => i.config.name.indexOf('classes') !== -1)
  }


  /**
   * Cierra sesión en la aplicación
   */
  logOut () {
    this.authService.logout()
    this.routerService.navigate('iniciar-sesion')
  }
}
