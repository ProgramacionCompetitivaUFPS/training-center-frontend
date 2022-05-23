import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

/**
 * NavMain (Service)
 * Servicio que estiona los items del navbar-header cuando un usuario se encuentra en Colegios, Universidades o Principal
 * @export
 * @class navMain
 */

/**
 * Realiza la inyección de dependencias en la clase.
 * @return array con las dependencias
 */

@inject(Router)
export class navMain {


    /**
     * Crea una instancia de NavMain
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(routerService) {
        this.routerService = routerService
        console.log("navbar_main")
            // this.changeMessageMain()
    }

    /**
     * Cambia el contenido del item main en el navbar, verificando si el usuario está en principal, colegios u universidades
     * @param {title} título del elemento del navbar main
     */
    changeMessageMain() {
        // const navbar_main = document.querySelector('#nav-main')
        console.log("navbar_main")
            /*
                    const messageMain = this.routerService.currentInstruction.params.childRoute
                    if (!messageMain) {
                        this.element.innerHTML = 'Training Center'
                    } else {
                        navbar_main.innerHTML = this.messageMain.charAt(0).toUpperCase() + this.messageMain.slice(1)
                    }*/
    }

    /**changeMessageMain(item) {
        const navbar_main = document.querySelector('#nav-main')
        navbar_main.innerHTML = item

        if (item === 'Colegios')
            this.routerService.navigate('/principal/colegios')
        else this.routerService.navigate('/problemas/universidades')
    } */



}