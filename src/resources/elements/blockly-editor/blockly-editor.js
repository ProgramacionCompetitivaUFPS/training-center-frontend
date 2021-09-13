//import * as Blockly from 'Blockly'
//import 'Blockly/python'
import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import 'blockly/python'
import 'blockly/javascript'
import * as Es from 'blockly/msg/es';

import { define_panda_variable_blocks } from './typed_variables.js'

/**
 * BlocklyEditor (Element)
 * Clase encargada de la creación de un editor en el lenguaje Blockly
 * @export
 * @class BlocklyEditor
 */

export class BlocklyEditor {

    constructor() {
        setTimeout(() => {
        //window.$(function() {
            Blockly.setLocale(Es);


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
            console.log("acá estoy")
            var obj = document.getElementById('blockly-editor');
            var workspace = Blockly.inject(obj, options)
            
            //this.createBlocksCustomized()
            //.createGeneratorCodes()


            const createFlyout = function (workspace) {

                let xmlList = [];
                // Add your button and give it a callback name.

                const button = document.createElement('button');
                button.setAttribute('text', 'Create Typed Variable');
                button.setAttribute('callbackKey', 'Panda');

                workspace.registerButtonCallback('Panda', (button) => {
                    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'Panda');
                });

                xmlList.push(button);


                //Creando los bloques de getter y setter

                const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);

                console.log(blockList);
                xmlList = xmlList.concat(blockList);
                return xmlList;
            }

            workspace.registerToolboxCategoryCallback('CREATE_TYPED_VARIABLE', createFlyout)

            Blockly.Xml.domToWorkspace(this.workspaceBlocks, workspace);

            var xml_example_text;

            if (sessionStorage.getItem('xmlCode')) {
                xml_example_text = sessionStorage.getItem('xmlCode')
            } else {
                xml_example_text = `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="XU)j],aCx_e_I540dPH#">count</variable><variable id="3.hwej-DXj0icz|?W?zz">nombre</variable></variables><block type="variables_set" id="7%E0I.MW\`f5W6MNTP@:" x="-486" y="67"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field><value name="VALUE"><block type="text_prompt_ext" id=")y/c|+john+o$,^+{z(u"><mutation type="NUMBER"></mutation><field name="TYPE">NUMBER</field><value name="TEXT"><shadow type="text" id="u|OniKM+4Z2H~ZV%ckoF"><field name="TEXT">abc</field></shadow><block type="text" id="-@[e5C!*Zvnjdw3G[0UM"><field name="TEXT"></field></block></value></block></value><next><block type="controls_repeat_ext" id="[}I#LS9,s)XnA3Eb=M]Y"><value name="TIMES"><shadow type="math_number" id="N\`SKYlg3HwRr[,Ob!2UR"><field name="NUM">10</field></shadow><block type="variables_get" id="bY@qGOu1|74ihzKD}!hU"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field></block></value><statement name="DO"><block type="variables_set" id="Rm{^L#^}lKztw2?t7YQ|"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field><value name="VALUE"><block type="text_prompt_ext" id="pVqk5E@o;Q=T68)ym0c,"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field><value name="TEXT"><shadow type="text" id=":2KS40/T{+k0;B};A!GC"><field name="TEXT">abc</field></shadow><block type="text" id="/y05rgmIDFLZA}#xxlgv"><field name="TEXT"></field></block></value></block></value><next><block type="text_print" id="J*UC:x]-V)fskW[Zc%+3"><value name="TEXT"><shadow type="text" id="|lJ#M01l)l23rDqofTv+"><field name="TEXT">abc</field></shadow><block type="text_join" id="ZW35WG;*5PB1\`))lg%20"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="Wb}{BeM|4e8E[dn62MdA"><field name="TEXT">Hola </field></block></value><value name="ADD1"><block type="variables_get" id="CCuXuzW.4oOa)an|r)g4"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field></block></value></block></value></block></next></block></statement></block></next></block></xml>`

                // que esto se guarde en el session storage y se actualice cada ciertos segundos
                // Almacena la información en sessionStorage
                sessionStorage.setItem('xmlCode', xml_example_text)
            }


            let xml_example = Blockly.Xml.textToDom(xml_example_text)

            //insertar código base en el workspace
            Blockly.Xml.domToWorkspace(xml_example, workspace)

            //ejemplo de generador de código
            Blockly.Python.addReservedWords('code')
            setInterval(() => {

                // Extraer xml del código del código en un tablero
                var xml = Blockly.Xml.workspaceToDom(workspace)

                //convertir xml a texto plano
                var xml_text = Blockly.Xml.domToText(xml)
                //console.log(typeof(xml_text))
                //console.log(xml_text)

                // convertir texto plano a xml
                var xml_return = Blockly.Xml.textToDom(xml_text)

                var code = Blockly.Python.workspaceToCode(workspace)
                //document.getElementById('generate').innerText = code

                //guardar en sessionStorage el código convertido a python
                sessionStorage.setItem('pythonCode', code)
                // console.log(code)

                /*  try {
                      
                      eval(code)
                  // document.getElementById('output').innerText = output
                  } catch (e) {
                      alert(e)
                  }*/


            }, 2000)

        // })
            

        }, 3000)

    }

    /**
     * Inserta los bloques personalizados al workspace de trabajo
     */
    createBlocksCustomized() {

        Blockly.Blocks['prompt_for'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Prompt variable of ")
                    .appendField(new Blockly.FieldDropdown([
                        ["Integer", "Integer"],
                        ["Double", "Double"],
                        ["String", "String"],
                        ["Character", "Character"],
                        ["Boolean", "Boolean"]
                    ]), "Data type")
                    .appendField("type");
                this.setInputsInline(false);
                this.setOutput(true, null);
                this.setColour(285);
                this.setTooltip("");
                this.setHelpUrl("https://www.w3schools.com/jsref/met_win_prompt.asp");
            }
        };

        Blockly.Blocks['create_variable'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Declare")
                    .appendField(new Blockly.FieldDropdown([
                        ["Integer", "Integer"],
                        ["Double", "Double"],
                        ["Text", "Text"],
                        ["Character", "Boolean"],
                        ["Boolean", "Boolean"]
                    ]), "NAME")
                    .appendField("Variable");
                this.setColour(230);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };

        Blockly.Blocks['print'] = {
            init: function () {
                this.appendValueInput("TEXT")
                    .setCheck(null)
                    .appendField("Imprimir");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(330);
                this.setTooltip("Imprimir");
                this.setHelpUrl("");
            }
        };
    }

    /**
     * Crea los generadores a código fuente personalizados
     */
    createGeneratorCodes() {
        Blockly.JavaScript['print'] = function (block) {
            var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
                Blockly.JavaScript.ORDER_NONE) || '\'\'';
            // var code = 'console.log('+msg+')';
            //  if(msg === undefined) msg = ""
            var code = `document.getElementById('output').innerText = document.getElementById('output').innerText + ${msg};\n`
            return code;
        };
    }

}