import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Material, UserSignIn } from 'models/models'
import { Alert, Auth, Materials, Institutions } from 'services/services'
import { Jwt } from 'services/jwt'

/**
 * Admin (Module)
 * Módulo encargado de la administración de la plataforma.
 * @export
 * @class Admin
 */

// dependencias a inyectar: Servicio de notificaciones (Alert), 
// servicio de autenticación y validación de usuarios (Auth),
// servicio de backend de material (Material)
@inject(Alert, Auth, Materials, Jwt, Institutions)
export class Admin {
    // Elementos observables. 
    @observable page
    @observable filterChange
    @observable pageUsers
    @observable filterChangeUser

    /**
     * Inicializa una instancia de Admin.
     * @param {service} alertService - Servicio de notificaciones
     * @param {service} authService - Servicio de autenticación y validación
     * @param {material} materialService - Servicio de material
     * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
     * @param {service} institutionService - Servicio de manejo de instituciones
     */


    constructor(alertService, authService, materialService, jwtService, institutionService) {
        this.alertService = alertService
        this.authService = authService
        this.jwtService = jwtService
        this.institutionService = institutionService
        this.materialService = materialService
        this.newUser = new UserSignIn()
        this.newUser.type = 1
        this.numberOfItems = [10, 15, 20]
        this.sortOptions = ['Id', 'Nombre', 'Usuario', "Código"]
        this.filterChange = false
        this.limit = 10
        this.sort = 'Id'
        this.by = 'Ascendente'
        this.page = 1
        this.totalPages = 1

        this.numberOfUsersToShow = [10, 20, 30]
        this.filterChangeUser = false
        this.limitUsers = 10
        this.sortUsers = 'Id'
        this.byUsers = 'Ascendente'
        this.pageUsers = 1
        this.totalPagesUsers = 1

        this.institucion = ""

        this.getUsers()
        this.getMaterials()
        this.getUniversities()
    }

    cambiarInstitucion(institucion) {
            if (institucion == " ") {
                this.idInstitution = " "
                this.institucion = " "
                this.users = [];
                this.universities = []
                return;
            }
            this.institucion = institucion;
            if (institucion === "Universidad") {
                this.getUniversities();
                this.users = [];

            } else if (institucion === "Colegio") {
                this.getColleges();
                this.users = [];

            }
            document.getElementById("elegirInst").value = -1;


        }
        /**
         * Cuando cambia un filtro, obtiene el material con los nuevos parametros.
         * @param {bool} act - Nuevo estado 
         * @param {bool} prev - Antiguo estado
         */
    filterChangeChanged(act, prev) {
        if (prev !== undefined) this.getMaterials()
    }

    /**
     * Cuando cambia un filtro, obtiene los usuarios con los nuevos parametros.
     * @param {bool} act - Nuevo estado 
     * @param {bool} prev - Antiguo estado
     */
    filterChangeUserChanged(act, prev) {
        if (prev !== undefined) this.getUsers()
    }

    /**
     * Detecta cuando el número de página es modificado para solicitar el nuevo número.
     * @param {Number} act - Número de página nuevo.
     * @param {Number} prev - Número de página antes del cambio
     */
    pageChanged(act, prev) {
        if (prev !== undefined) this.getMaterials()
    }

    /**
     * Detecta cuando el número de página es modificado para solicitar el nuevo número.
     * @param {Number} act - Número de página nuevo.
     * @param {Number} prev - Número de página antes del cambio
     */
    pageUsersChanged(act, prev) {
        if (prev !== undefined) this.getUsers()
    }

    /**
     * Obtiene los materiales pendientes de aprobación.
     */
    getMaterials() {
        this.materialService.getPendingMaterial(this.page, this.limit, (this.sort === 'Nombre') ? 'name' : undefined, (this.by === 'Ascendente' ? 'asc' : 'desc'))
            .then(data => {
                this.materials = []
                this.totalPages = data.meta.totalPages
                if (this.totalPages !== 0) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.materials.push(new Material(data.data[i].id, data.data[i].name, data.data[i].category_id, undefined, undefined, data.data[i].url, undefined, data.data[i].category.name))
                    }
                }
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.materialDoesNotExist)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }

    /**
     * Obtiene los usuarios.
     */
    getUsers() {
        this.authService.getUsers(this.pageUsers, this.limitUsers, this.sortUsers, (this.byUsers === 'Ascendente' ? 'ASC' : 'DESC'))
            .then(data => {
                this.users = []
                this.totalPagesUsers = data.meta.totalPages
                if (this.totalPagesUsers !== 0) {
                    for (let i = 0; i < data.data.length; i++) {
                        if (this.authService.getUserId() !== data.data[i].id) this.users.push(new UserSignIn(data.data[i].email, undefined, undefined, data.data[i].name, data.data[i].username, data.data[i].code, data.data[i].type, data.data[i].id, data.data[i].institution))
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

    /**
     * Crea un nuevo usuario docente o administrador en la plataforma.
     */
    createUser() {
        if (!this.newUser.isValid()) {
            this.alertService.showMessage(MESSAGES.superUserWrongData)
        } else if (this.newUser.username.length < 6 || this.newUser.username.length > 30) {
            this.alertService.showMessage(MESSAGES.usernameInvalid)
        } else if (this.newUser.password !== this.newUser.confirmPassword) {
            this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
        } else {
            this.authService.createSuperUser(this.newUser)
                .then(() => {
                    this.alertService.showMessage(MESSAGES.superUserCreated)
                }).catch(error => {
                    if (error.status === 400) {
                        this.alertService.showMessage(MESSAGES.superUserWrongData)
                    } else {
                        this.alertService.showMessage(MESSAGES.serverError)
                    }
                })
        }
    }

    /**
     * Aprueba un material en la plataforma.
     * @param {Number} id - Identificador del material.
     */
    approveMaterial(id) {
        this.materialService.approve(id)
            .then(() => {
                this.alertService.showMessage(MESSAGES.materialApproved)
                this.getMaterials()
            }).catch(() => {
                this.alertService.showMessage(MESSAGES.serverError)
            })
    }

    /**
     * Muestra un popup para confirmar la eliminación del material indicado por id.
     * @param {number} id - Identificador del material a eliminar.
     */
    showRemoveMaterial(id) {
        this.materialToRemove = id
        window.$('#remove-material').modal('show')
    }


    /**
     * Muestra un popup para confirmar la eliminación del usuario indicado por id.
     * @param {number} id - Identificador del usuario a eliminar.
     */
    showRemoveUser(id) {
        this.userToRemove = id
        window.$('#remove-user').modal('show')
    }

    /**
     * Elimina un material que no ha sido aprobado.
     */
    removeMaterial() {
        this.materialService.remove(this.materialToRemove)
            .then(() => {
                this.alertService.showMessage(MESSAGES.materialDeleted)
                this.getMaterials()
                window.$('#remove-material').modal('hide')
            }).catch(() => {
                this.alertService.showMessage(MESSAGES.serverError)
                window.$('#remove-material').modal('hide')
            })
    }

    /**
     * Elimina un usuario de la plataforma.
     */
    removeUser() {
        this.authService.removeUser(this.userToRemove)
            .then(() => {
                this.alertService.showMessage(MESSAGES.userDeleted)
                this.getUsers()
                window.$('#remove-user').modal('hide')
            }).catch(() => {
                this.alertService.showMessage(MESSAGES.serverError)
                window.$('#remove-user').modal('hide')
            })
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
            this.users = [];
            return;
        }

        this.institutionService.getUsersByInstitution(idInstitution)
            .then(data => {
                this.users = data.data
            }).catch(error => {
                if (error.status === 404) {
                    this.alertService.showMessage(MESSAGES.unknownError)
                } else {
                    this.alertService.showMessage(MESSAGES.serverError)
                }
            })
    }
}