
export class App {
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.options.pushState = true
    config.options.root = '/'
    config.map([
      { route: ['', 'iniciar-sesion'], moduleId: './modules/login/login', title: 'Iniciar Sesión', layoutView: './layouts/not-logged.html' },
      { route: 'registro', moduleId: './modules/signin/signin', title: 'Regístrate', layoutView: './layouts/not-logged.html' },
      { route: 'recuperar-password', moduleId: './modules/recovery/recovery-password', title: 'Recuperar Contraseña', layoutView: './layouts/not-logged.html' },
      { route: 'cambiar-password', moduleId: './modules/recovery/reset-password', title: 'Recuperar Contraseña', layoutView: './layouts/not-logged.html' }
    ])
    config.mapUnknownRoutes('./modules/404')
    this.router = router
  }
}
