import { Redirect } from 'aurelia-router'
import { Auth } from 'services/auth'


export class App {
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.options.pushState = true
    config.options.root = '/'
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      // Login
      {
        name: 'login',
        route: 'iniciar-sesion',
        moduleId: './modules/login/login',
        title: 'Iniciar Sesión',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Signin
      {
        name: 'signin',
        route: 'registro',
        moduleId: './modules/signin/signin',
        title: 'Regístrate',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Recovery Password
      {
        name: 'recovery-password',
        route: 'recuperar-password',
        moduleId: './modules/recovery/recovery-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Reset Password
      {
        name: 'reset-password',
        route: 'cambiar-password',
        moduleId: './modules/recovery/reset-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      },
      // Home
      {
        name: 'home',
        route: '',
        moduleId: './modules/home/home',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      }
    ])
    this.router = router
  }
}

class AuthorizeStep {
  static inject () {
    return [Auth]
  }

  constructor (authService) {
    this.authService = authService
  }
  run (navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
      if (this.authService.isAdmin()) {
        return next()
      }
    }
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('coach') !== -1)) {
      if (this.authService.isCoach()) {
        return next()
      }
    }
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('student') !== -1)) {
      if (this.authService.isStudent()) {
        return next()
      }
    }

    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('visitor') !== -1)) {
      if (!this.authService.isVisitor()) {
        return next.cancel(new Redirect(''))
      } else {
        return next()
      }
    }
    if (this.authService.isVisitor()) {
      return next.cancel(new Redirect('iniciar-sesion'))
    } else {
      return next.cancel(new Redirect(''))
    }
  }
}
