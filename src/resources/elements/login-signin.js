import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { UserSignIn, UserLogIn } from 'models/models'
import { Alert, Auth } from 'services/services'

/**
 * Signin (module)
 * Módulo para el login y registro de estudiantes
 * @export
 * @class Signin
 */

//dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth), Enrutamiento (Router)
@inject(Alert, Auth, Router)
export class LoginSignin {

  isLoginModalVisible = true
  isSignInModalVisible = false

  /**
   * Crea una instancia de Signin.
   * @param {service} alertService - Servicio de notificaciones y mensajes
   * @param {service} authService - Servicio de autenticación y registro
   * @param {service} router - Servicio de enrutamiento
   */
  constructor(alertService, authorizationService, router) {
    this.alertService = alertService
    this.authorizationService = authorizationService
    this.router = router

    //Usuario para login
    this.userLogin = new UserLogIn()
    this.userLogin.code = 0
    this.userLogin.type = 0

    //Usuario para registro
    this.UserSignIn = new UserSignIn()
    this.UserSignIn.code = 0
    this.UserSignIn.type = 0
    this.isValidEmail = false
  }

  /**
    * Valida los datos e intenta iniciar sesión
    */
  login() {

    if (this.userLogin.email !== '' && this.userLogin.password !== '' && this.userLogin.email != null && this.userLogin.password !== null) {
      this.authorizationService.auth(this.userLogin)
        .then((data) => {
          this.authorizationService.login(data.token)
          this.router.navigate('')
        }) // Si el inicio es valido, guarda el token y redirige al inicio
        .catch(error => {
          switch (error.status) {
            case 401:
              this.alertService.showMessage(MESSAGES.loginWrongData)
              this.userLogin = new UserLogIn()
              break
            case 500:
              this.alertService.showMessage(MESSAGES.serverError)
              break
            default:
              this.alertService.showMessage(MESSAGES.unknownError)
          }
        })
    } else {
      this.alertService.showMessage(MESSAGES.loginIncompleteData)
    }
  }

  /**
   * Envia al servidor los datos del nuevo usuario a registrar.
   */
  signin() {
    if (this.UserSignIn.isValid()) {
      if (this.UserSignIn.password === this.UserSignIn.confirmPassword) {
        this.authorizationService.registerStudent(this.UserSignIn)
          .then(() => {
            this.alertService.showMessage(MESSAGES.signInCorrect)
            this.router.navigate('iniciar-sesion')
          }) // Si el registro es correcto se redirige al inicio de sesión
          .catch((error) => {
            switch (error.status) {
              case 400:
                this.alertService.showMessage(MESSAGES.signInWrongData)
                break
              case 401:
                this.alertService.showMessage(MESSAGES.permissionsError)
                break
              case 500:
                this.alertService.showMessage(MESSAGES.serverError)
                break
              default:
                this.alertService.showMessage(MESSAGES.unknownError)
            }
          })
      } else { // Si las contraseñas no coinciden, ambas se reinician para ingresarlas de nuevo
        this.alertService.showMessage(MESSAGES.signInDifferentPasswords)
        this.UserSignIn.password = ''
        this.UserSignIn.confirmPassword = ''
      }
    } else if (this.UserSignIn.username.length < 6) {
      this.alertService.showMessage(MESSAGES.usernameInvalid)
    } else {
      this.alertService.showMessage(MESSAGES.signInIncompleteData)
    }
  }

  validEmail() {
    if (/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.UserSignIn.email)) this.isValidEmail = true
    else this.isValidEmail = false
  }

  /**
   * Muestra formulario Login
   */
  activateLoginModal() {
    this.isLoginModalVisible = true
    this.isSignInModalVisible = false

  }

  /**
   * Muestra formulario Registro
   */
  activateSignInModal() {
    this.isLoginModalVisible = false
    this.isSignInModalVisible = true

  }
}
