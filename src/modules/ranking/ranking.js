import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Alert, Rankings, Auth, Institutions, Problems } from 'services/services'


@inject(Alert, Rankings, Auth, Institutions, Problems)
export class Ranking {
    // Elementos observables. 
    @observable page
    date = new Date;
    /**
     * Inicializa el ranking
     */
    constructor(alertService, rankingService, authService, institutionService, problemsService) {
        this.alertService = alertService
        this.rankingService = rankingService
        this.institutionService = institutionService
        this.authService = authService
        this.problemsService = problemsService


        this.page = 1
        this.totalPages = 1
        this.dataLoaded = false
        this.users = []

        this.year = this.date.getFullYear()
        this.años = []
        this.año()


        this.institucion = ""

        this.categories = []
        this.getRanking();
        this.getCategories2()
        this.getColleges()
        this.getUniversities()


    }

    /**
     * Detecta cuando el número de página es modificado para solicitar el nuevo número.
     * @param {Number} act - Número de página nuevo.
     * @param {Number} prev - Número de página antes del cambio
     */
    pageChanged(act, prev) {
        if (prev !== undefined) this.getRanking()
    }

    getRanking() {
        this.rankingService.getRanking(30, this.page)
            .then(data => {
                console.log(data)
                this.totalPages = data.meta.totalPages
                this.users = data.data
                this.dataLoaded = true
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    getRankingInstitution(id) {

        if (id == " ") {
            this.users = [];
            return;
        }

        this.rankingService.getRankingInstitution(30, this.page, id)
            .then(data => {
                console.log(this.totalPages = data.meta.totalPages)
                this.users = data.data
                this.dataLoaded = true
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    getRankingAnio(año) {
        this.rankingService.getRankingAnio(30, this.page, año)
            .then(data => {
                console.log(this.totalPages = data.meta.totalPages)
                this.users = data.data
                this.dataLoaded = true
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    getRankingCategory(id) {
        this.rankingService.getRankingCategory(30, this.page, id)
            .then(data => {
                console.log(this.totalPages = data.meta.totalPages)
                this.users = data.data
                this.dataLoaded = true
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    cambiarInstitucion(institucion) {
        document.getElementById("elegirInst").value = -1;
        this.users = [];
        this.institucion = institucion;

        if (institucion === "Universidad") {
            this.getUniversities();
        } else if (institucion === "Colegio") {
            this.getColleges();

        }

    }
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

    año() {
        let a = 2018;
        for (let i = 0; i < (this.year - 2018) + 1; i++) {
            this.años[i] = a++;
        }
    }

    getCategories2() {
        this.problemsService.getCategories2()
            .then(data => {
                this.categories = data.categories
                if (this.categories.length === 0) {
                    this.alertService.showMessage(MESSAGES.categoriesEmpty)
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    this.alertService.showMessage(MESSAGES.permissionsError)
                } else {
                    this.alertService.showMessage(MESSAGES.unknownError)
                }
            })
    }


}