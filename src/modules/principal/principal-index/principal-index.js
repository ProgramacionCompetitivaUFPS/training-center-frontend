import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

/**
 * Principal(Module)
 * Módulo encargado de mostrar las opciones de aprendizajes y entrenamiento:
 * Training Center University y Training Center High School
 * @export
 * @class Principal
 */

// dependencias a inyectar: 
// servicio de Router (Router)
@inject(Router)
export class Principal {


    /**
     * Crea una instancia de Principal.
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(routerService) {
        this.routerService = routerService;
    }
    

}