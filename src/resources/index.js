export function configure(config) {
    config.globalResources([
        PLATFORM.moduleName('./attributes/markdown'),
        PLATFORM.moduleName('./attributes/tooltip'),
        PLATFORM.moduleName('./elements/loading-indicator'),
        PLATFORM.moduleName('./elements/app-header'),
        PLATFORM.moduleName('./elements/canvas-principal'),
        PLATFORM.moduleName('./elements/blockly-editor/blockly-editor')
    ])
}