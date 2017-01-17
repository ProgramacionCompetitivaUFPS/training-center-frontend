

export class App {
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.map([
      { route: '', moduleId: './modules/login/login', title: 'Iniciar Sesión' }
    ])

    this.router = router
  }
}
