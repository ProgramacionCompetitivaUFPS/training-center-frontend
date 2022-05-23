import Swiper from 'swiper/swiper-bundle.min.js'
import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { Auth } from 'services/services'
import introJs from 'intro.js';
import 'intro.js/introjs.css';

/**
 * Home (Module)
 * Clase que genera la vista bienvenida.
 * @export
 * @class Home
 */

@inject(Auth, Router)
export class Home {
    
  
    /**
     * Crea una instancia de Home.
     * @param {service} authService - Servicio de autenticación
     * @param {service} routerService - Servicio de enrutamiento
     */
    constructor(authService, routerService) {
      this.authService = authService
      this.routerService = routerService

        var swiper = new Swiper(this.mySwiper, {
            pagination: {
              el: this.swiperPagination,
            },
          })
    }
    tour(){
      introJs().start();
  }
}
