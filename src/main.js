import * as environment from '../config/environment.json'
import { PLATFORM } from 'aurelia-pal'
import { Promise } from "bluebird";
import 'whatwg-fetch'

// Configure Bluebird Promises.
Promise.config({
    longStackTraces: environment.debug,
    warnings: false
})

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging(environment.debug ? 'debug' : 'warn')
        .feature(PLATFORM.moduleName('resources/index'))
        .plugin(PLATFORM.moduleName('aurelia-notify'), settings => {
            settings.timeout = 40000
            settings.limit = 1
        })
        //aurelia.use.plugin(PLATFORM.moduleName('aurelia-chart'))

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
    }

    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')))
}