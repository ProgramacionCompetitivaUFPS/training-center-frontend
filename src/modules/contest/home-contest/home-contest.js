import { inject } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Alert, Auth } from 'services/services'

/**
 * HomeContest (Module)
 * Módulo encargado de manejar las maratones de programación
 * @export
 * @class HomeContest
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth)
@inject(Alert, Auth)
export class HomeContest {

  constructor () {
    this.numberOfItems = [10, 15, 20]
    this.sortOptions = ['Id', 'Nombre']
    this.filterChange = false
    this.limit = 10
    this.sort = 'Id'
    this.by = 'Ascendente'
    this.page = 1
    this.totalPages = 1
  }
}
