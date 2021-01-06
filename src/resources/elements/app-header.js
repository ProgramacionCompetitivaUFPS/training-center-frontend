import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { Auth } from 'services/services'

/**
 * AppHeader (Element)
 * Clase que genera un navbar para los usuarios autenticados.
 * @export
 * @class AppHeader
 */
@inject(Auth, Router)
export class AppHeader {


    /**
     * Crea una instancia de AppHeader.
     * @param {service} authService - Servicio de autenticación
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(authService, routerService) {
        this.authService = authService
        this.routerService = routerService
        this.query = ''
    }


    /**
     * Genera las banderas que indican a los botones del navbar cuando deben activarse.
     * Este método hace parte del ciclo de vida de un componente aurelia y se dispara en el momento
     * en que el componente es añadido al Document Object Model (Dom)
     */
    attached() {

        // Banderas para validar el botón activo en el navbar
        this.schools = (this.routerService.navigation.find(i => i.config.name.indexOf('schools') !== -1))
        this.problems = this.routerService.navigation.find(i => i.config.name.indexOf('problems') !== -1)
        this.searchB = this.routerService.navigation.find(i => i.config.name.indexOf('search') !== -1)
        this.ranking = this.routerService.navigation.find(i => i.config.name.indexOf('ranking') !== -1)
        this.classes = this.routerService.navigation.find(i => i.config.name.indexOf('classes') !== -1)
        this.admin = this.routerService.navigation.find(i => i.config.name.indexOf('admin') !== -1)
        this.contest = this.routerService.navigation.find(i => i.config.name.indexOf('contest') !== -1)
    }

    /**
     * Cierra sesión en la aplicación
     */
    logOut() {
        this.authService.logout()
        this.messageMain = 'Training Center'
        this.routerService.navigate('iniciar-sesion')

    }

    search() {
        if (this.query.length > 0) this.routerService.navigate('/buscar/' + this.query.replace(/\s/g, '+'))
    }
}