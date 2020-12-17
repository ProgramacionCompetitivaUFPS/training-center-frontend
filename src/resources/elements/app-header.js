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

    messages = [
        { title: 'Training Center', description: 'Ir a principal', href: '/' },
        { title: 'Colegios', description: 'Ir a Training Center High School', href: 'principal/colegios' },
        { title: 'Universidades', description: 'Ir a Training Center Universities', href: 'problemas/universidades' },
    ];

    constructor(authService, routerService) {
        this.authService = authService
        this.routerService = routerService
        this.query = ''
        this.changeMessageMain()
    }

    /**
     * Cambia el contenido del item main en el navbar, verificando si el usuario está en principal, colegios u universidades
     * @param {title} título del elemento del navbar main
     */
    changeMessageMain() {
        this.messageMain = this.routerService.currentInstruction.params.childRoute
        if (!this.messageMain) {
            this.messageMain = 'Training Center'
        } else {
            this.messageMain = this.messageMain.charAt(0).toUpperCase() + this.messageMain.slice(1)
        }
    }


    /**
     * Genera las banderas que indican a los botones del navbar cuando deben activarse.
     * Este método hace parte del ciclo de vida de un componente aurelia y se dispara en el momento
     * en que el componente es añadido al Document Object Model (Dom)
     */
    attached() {

        // Banderas para validar el botón activo en el navbar
        this.main = (this.routerService.navigation.find(i => i.config.name.indexOf('principal') !== -1))
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