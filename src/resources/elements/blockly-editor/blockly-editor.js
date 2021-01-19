import * as Blockly from 'Blockly';

/**
 * BlocklyEditor (Element)
 * Clase encargada de la creación de un editor en el lenguaje Blockly
 * @export
 * @class BlocklyEditor
 */

export class BlocklyEditor {

    constructor() {
        setTimeout(() => {
            //     Blockly.setLocale(Es);


            var options = {
                toolbox: this.workspaceBlocks,
                collapse: true,
                comments: true,
                disable: true,
                maxBlocks: Infinity,
                trashcan: true,
                horizontalLayout: false,
                toolboxPosition: 'start',
                css: true,
                media: 'https://blockly-demo.appspot.com/static/media/',
                rtl: false,
                scrollbars: true,
                sounds: true,
                oneBasedIndex: true,
                grid: {
                    spacing: 20,
                    length: 1,
                    colour: '#888',
                    snap: false
                }
            };

            var workspace = Blockly.inject(this.blocklyDiv, options);
            Blockly.Xml.domToWorkspace(this.workspaceBlocks, workspace);

            console.log(workspace);

        }, 3000);
    }

   /* activate(params ) {

    }*/

}