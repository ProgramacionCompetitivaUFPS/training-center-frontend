import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Contest } from 'models/models'
import { Alert, Auth, Contests, Institutions } from 'services/services'

/**
 * HomeContest (Module)
 * Módulo encargado de manejar las maratones de programación
 * @export
 * @class HomeContest
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth), servicio de maratones (Contests)
@inject(Alert, Auth, Contests, Institutions)
export class HomeContest {

    // Elementos observables. 
    @observable filterChangeMyContests
    @observable pageMyContests
    @observable filterChangeAllContests
    @observable totalPagesMyContests
    @observable byAllContests
    @observable byMyContests

    /**
     * Inicializa una instancia de HomeContest.
     */
    constructor(alertService, authService, contestService, institutionService) {
        this.alertService = alertService
        this.authService = authService
        this.contestService = contestService
        this.numberOfItems = [10, 15, 20]
        this.sortOptions = ['Id', 'Nombre']
        this.filterChangeMyContests = false
        this.institutionService = institutionService
        this.limitMyContests = 10
        this.sortMyContests = 'Id'
        this.byMyContests = 'Ascendente'
        this.byMyContestsQuery = 'ASC'
        this.pageMyContests = 1
        this.totalPagesMyContests = 0
        this.filterChangeAllContests = false
        this.limitAllContests = 10
        this.sortAllContests = 'Id'
        this.byAllContests = 'Ascendente'
        this.byAllContestsQuery = 'ASC'
        this.pageAllContests = 1
        this.totalPagesAllContests = 0
        this.myContests = []
        this.allContests = []
        this.institucion = []

        this.getMyContests()
        this.getContests()
    }

    /**
     * Detecta cuando el número de página es modificado para solicitar el nuevo número.
     * @param {Number} act - Número de página nuevo.
     * @param {Number} prev - Número de página antes del cambio
     */
    pageMyContestsChanged(act, prev) {
            if (prev !== undefined) this.getMyContests()
        }
        /**
         * Detecta cuando el número de página es modificado para solicitar el nuevo número.
         * @param {Number} act - Número de página nuevo.
         * @param {Number} prev - Número de página antes del cambio
         */

    filterChangeMyContestsChanged(act, prev) {

            if (prev !== undefined) this.getMyContests();

        }
        /**
         * Detecta cuando el número de página es modificado para solicitar el nuevo número.
         * @param {Number} act - Número de página nuevo.
         * @param {Number} prev - Número de página antes del cambio
         */
    pageAllContestsChanged(act, prev) {

            if (prev !== undefined) this.getContests()
        }
        /**
         * Detecta cuando el número de página es modificado para solicitar el nuevo número.
         * @param {Number} act - Número de página nuevo.
         * @param {Number} prev - Número de página antes del cambio
         */
    filterChangeAllContestsChanged(act, prev) {

        if (prev !== undefined) this.getContests()
    }

    byAllContestsChanged(act, prev) {
        this.byAllContestsQuery = this.byContestsChange(act)
        if (prev !== undefined) this.getContests()
    }

    byMyContestsChanged(act, prev) {
        this.byMyContestsQuery = this.byContestsChange(act)
        if (prev !== undefined) this.getMyContests()
    }

    byContestsChange(act) {
        let final = "";
        if (act == "Ascendente")
            final = "ASC"
        else
            final = "DESC"
        return final;
    }

    /**
     * Obtiene todas las maratones de programación creadas por el usuario
     * actualmente logueado.
     */
    getMyContests() {
        this.contestService.getMyContests(this.limitMyContests, this.pageMyContests, this.authService.getUserId(), this.sortMyContests, this.byMyContestsQuery)
            .then(data => {
                this.totalPagesMyContests = data.meta.totalPages
                this.myContests = []
                if (this.totalPagesMyContests > 0) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.myContests.push(new Contest(data.data[i].title, data.data[i].description, data.data[i].init_date, data.data[i].end_date, data.data[i].rules, data.data[i].public, undefined, data.data[i].id, data.data[i].institution))
                    }
                }
            })
            .catch(error => {
                if (error.status === 400) {
                    this.alertService.showMessage(MESSAGES.contestError)
                } else if (error.status === 401) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
            })
    }

    /**
     * Obtiene todas las maratones de programación próximas.
     */
    getContests() {
        this.contestService.getContests(this.limitAllContests, this.pageAllContests, this.sortAllContests, this.byAllContestsQuery)
            .then(data => {
                this.totalPagesAllContests = data.meta.totalPages
                this.allContests = []
                if (this.totalPagesAllContests > 0) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.allContests.push(new Contest(data.data[i].title, data.data[i].description, data.data[i].init_date, data.data[i].end_date, data.data[i].rules, data.data[i].public, undefined, data.data[i].id, data.data[i].institution))
                    }
                }
            })
            .catch(error => {
                if (error.status === 400) {
                    this.alertService.showMessage(MESSAGES.contestError)
                } else if (error.status === 401) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
            })
    }

    showMessage() {
        this.alertService.showMessage(MESSAGES.temporarilyDisabled)
    }
    cambiarInstitucion(institucion) {

        if (institucion == " ") {
            this.idInstitution = " "
            this.institucion = " "
            this.getMyContests()
            this.universities = []
            return;
        }
        this.institucion = institucion;
        if (institucion === "Universidad") {
            this.getUniversities();
        } else if (institucion === "Colegio") {
            this.getColleges();

        }
    }

    /**
     * Obtiene las universidades.
     */
    getUniversities() {
        this.institutionService.getUniversities()
            .then(data => {
                this.universities = data.universities;
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    /**
     * Obtiene los colegios.
     */
    getColleges() {
        this.institutionService.getColleges()
            .then(data => {
                this.universities = data.universities;
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    filterByInstitution(idInstitution) {
        if (idInstitution == " ") {
            this.getMyContests();
            return;
        }
        this.institutionService.getContestsByInstitution(idInstitution)
            .then(data => {
                this.totalPagesAllContests = data.meta.totalPages
                this.myContests = []
                if (this.totalPagesAllContests > 0) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.myContests.push(new Contest(data.data[i].title, data.data[i].description, data.data[i].init_date, data.data[i].end_date, data.data[i].rules, data.data[i].public, undefined, data.data[i].id, data.data[i].institution))
                    }
                }
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }
}