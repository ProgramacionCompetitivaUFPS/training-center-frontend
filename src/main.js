import environment from './environment'
import 'fetch'

// Configure Bluebird Promises.
Promise.config({
  longStackTraces: environment.debug,
  warnings: false
})

/**
 * Configura el framework aurelia para inicializar la aplicación
 * @export
 * @param {any} aurelia - Core del framework
 */
export function configure (aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-notify', settings => {
      settings.timeout = 7000
    })

  if (environment.debug) {
    aurelia.use.developmentLogging()
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing')
  }

  aurelia.start().then(() => aurelia.setRoot())
}
