export class App {
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.map([
      { route: '', moduleId: 'no-selection', title: 'Select' }
    ])

    this.router = router
  }
}
