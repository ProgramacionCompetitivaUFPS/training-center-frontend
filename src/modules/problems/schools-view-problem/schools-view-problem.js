import { inject, bindable, bindingMode } from 'aurelia-framework'

import { Router } from 'aurelia-router'
import { MESSAGES, SETTINGS, API } from 'config/config'
import { Problem } from 'models/models'
import { Alert, Auth, Problems } from 'services/services'

import * as Es from 'blockly/msg/es'
import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import 'blockly/python'
import 'blockly/javascript'
import { define_panda_variable_blocks } from './typed_variables.js'


// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Problems, Router)
export class SchoolsViewProblem {
  /**
   * Crea una instancia de ViewProblem para colegios.
   * Contiene al módulo de blockly para Training center
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor(alertService, authService, problemService, routerService) {
    this.alertService = alertService;
    this.authService = authService;
    this.problemService = problemService;
    this.routerService = routerService;
    this.languages = SETTINGS.languages;
    this.language;
    this.code;
    this.files = {};
    this.sourceValid = false;

    this.DOMURL = self.URL || self.webkitURL || self;
  }

  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.id = params.id;
    this.lang = params.lang || "en";

    this.problemService
      .validateTypeCategory(this.id)
      .then((dataCategory) => {
        if (dataCategory.type == 1 || dataCategory.type == 0) {
          this.routerService.navigate("/");
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
        this.routerService.navigate("");
      });

    this.problemService
      .getProblem(this.id)
      .then((problem) => {
        problem = problem.problem;
        this.problem = new Problem(
          parseInt(params.id),
          problem.title_en,
          problem.title_es,
          parseInt(problem.level),
          parseInt(problem.category_id),
          undefined,
          problem.description_en,
          problem.description_es,
          problem.example_input !== "undefined"
            ? problem.example_input.replace(/\r\n/g, "\n")
            : "",
          problem.example_output !== "undefined"
            ? problem.example_output.replace(/\r\n/g, "\n")
            : "",
          parseFloat(problem.time_limit),
          problem.user_id,
          problem.user.username
        );
        if (problem.submissions.length > 0) this.problem.resolved = true;
        if (this.lang === "en" && !this.problem.isInEnglish()) {
          this.lang = "es";
        } else if (this.lang === "es" && !this.problem.isInSpanish()) {
          this.lang = "en";
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
        this.routerService.navigate("");
      });
  }

  /**
   * Si existe, muestra la versión en español del problema.
   */
  showES() {
    if (this.problem.isInSpanish()) {
      this.lang = "es";
    }
  }

  /**
   * Si existe, muestra la versión en ingles del problema.
   */
  showEN() {
    if (this.problem.isInEnglish()) {
      this.lang = "en";
    }
  }

  /**
   * Valida que el código enviado tiene uno de los formatos permitidos
   */
  validateCode() {
    if (this.code.length === 1) {
      if (
        this.code[0].name.endsWith(".java") ||
        this.code[0].name.endsWith(".cpp") ||
        this.code[0].name.endsWith(".c") ||
        this.code[0].name.endsWith(".cc") ||
        this.code[0].name.endsWith(".cp") ||
        this.code[0].name.endsWith(".cxx") ||
        this.code[0].name.endsWith(".py")
      ) {
        this.sourceValid = true;
        if (this.code[0].name.endsWith(".java")) {
          this.language = "Java";
          var reader = new FileReader();
          reader.onload = () => {
            let tmp = reader.result.replace(/ /g, "");
            tmp = tmp.replace(/\n|\r\n|\r/g, "");
            if (tmp.search("publicclassMain") < 0) {
              this.code = null;
              this.sourceValid = false;
              this.alertService.showMessage(MESSAGES.invalidJavaClassname);
            }
          };
          reader.readAsText(this.code[0]);
        } else if (this.code[0].name.endsWith(".py")) {
          this.language = "Python";
        } else if (
          this.code[0].name.endsWith(".cpp") ||
          this.code[0].name.endsWith(".c") ||
          this.code[0].name.endsWith(".cc") ||
          this.code[0].name.endsWith(".cp") ||
          this.code[0].name.endsWith(".cxx")
        ) {
          this.language = "C++";
        }
      } else {
        this.code = null;
        this.sourceValid = false;
        this.alertService.showMessage(MESSAGES.invalidCode);
      }
    }
  }

  processSources() {
    // Extraer xml del código en un tablero
    var xml = Blockly.Xml.workspaceToDom(this.workspace);

    //convertir xml a texto plano
    var xml_text = Blockly.Xml.domToText(xml);

    // convertir texto plano a xml
    var xml_return = Blockly.Xml.textToDom(xml_text);

    const pythonCode = Blockly.Python.workspaceToCode(this.workspace);
    console.log("generando svg...");
    //this.exportSVG();
    const urlSVG = this.generateSVG();

    return {
      pythonCode,
      xml,
      urlSVG
    }
  }

  /**
   * Preparar archivo .py, .XML y svg a partir de blockly toolbox
   */
  preSubmit() {
    const sources = this.processSources();
    console.log("sources", sources)
    //invocar evento en blockly editor para generar url del svg

    this.code = new File([sources.pythonCode], "main.py", {
      type: "text/x-python",
    });
    const XML = new File([sources.xml], "main.xml", {
      type: "text/xml",
    });

    this.files.codeFile = this.code;
    this.files.xmlBlocklyFile = XML;
    this.language = "Python";

    this.createFileSvg(sources.urlSVG, "blocks.svg");
  }

  submit() {
    this.problemService
      .submitSolution(this.id, this.language, undefined, undefined, this.files)
      .then((data) => {
        this.alertService.showMessage(MESSAGES.submittedSolution);
        this.language = null;
        this.code = null;
        this.sourceValid = false;
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
  }
  tour() {
    introJs().start();
  }

  createFileSvg(url, filename) {
    fetch(url).then((response) => {
      response.blob().then((data) => {
        let metadata = {
          type: "image/svg+xml",
        };
        let file = new File([data], filename, metadata);
        this.files.svgBlocklyCode = file;
        this.submit();
      });
    });
  }

  attached() {
    Blockly.setLocale(Es);

    var options = {
      toolbox: this.workspaceBlocks,
      collapse: true,
      comments: true,
      disable: true,
      maxBlocks: Infinity,
      trashcan: true,
      horizontalLayout: false,
      toolboxPosition: "start",
      css: true,
      media: "https://blockly-demo.appspot.com/static/media/",
      rtl: false,
      scrollbars: true,
      sounds: true,
      oneBasedIndex: true,
      grid: {
        spacing: 20,
        length: 1,
        colour: "#888",
        snap: false,
      },
    };

    this.workspace = Blockly.inject(this.blocklyDiv, options);

    //this.createBlocksCustomized()
    this.createGeneratorCodes();

    //registrar los bloques personalizados
    /*
            const createFlyout = function (this.workspace) {
                console.log("createFlyout");
                let xmlList = [];
                // Add your button and give it a callback name.

                const button = document.createElement('button');
                button.setAttribute('text', 'Create Typed Variable');
                button.setAttribute('callbackKey', 'Panda');

                this.workspace.registerButtonCallback('Panda', (button) => {
                    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'Panda');
                });

                xmlList.push(button);


                //Creando los bloques de getter y setter

                const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(this.workspace);

                console.log(blockList);
                xmlList = xmlList.concat(blockList);
                return xmlList;
            }

            this.workspace.registerToolboxCategoryCallback('CREATE_TYPED_VARIABLE', createFlyout)
            */

    Blockly.Xml.domToWorkspace(this.workspaceBlocks, this.workspace);

    var xml_example_text;

    if (sessionStorage.getItem("xmlCode")) {
      xml_example_text = sessionStorage.getItem("xmlCode");
    } else {
      xml_example_text = `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="XU)j],aCx_e_I540dPH#">count</variable><variable id="3.hwej-DXj0icz|?W?zz">nombre</variable></variables><block type="variables_set" id="7%E0I.MW\`f5W6MNTP@:" x="-486" y="67"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field><value name="VALUE"><block type="text_prompt_ext" id=")y/c|+john+o$,^+{z(u"><mutation type="NUMBER"></mutation><field name="TYPE">NUMBER</field><value name="TEXT"><shadow type="text" id="u|OniKM+4Z2H~ZV%ckoF"><field name="TEXT">abc</field></shadow><block type="text" id="-@[e5C!*Zvnjdw3G[0UM"><field name="TEXT"></field></block></value></block></value><next><block type="controls_repeat_ext" id="[}I#LS9,s)XnA3Eb=M]Y"><value name="TIMES"><shadow type="math_number" id="N\`SKYlg3HwRr[,Ob!2UR"><field name="NUM">10</field></shadow><block type="variables_get" id="bY@qGOu1|74ihzKD}!hU"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field></block></value><statement name="DO"><block type="variables_set" id="Rm{^L#^}lKztw2?t7YQ|"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field><value name="VALUE"><block type="text_prompt_ext" id="pVqk5E@o;Q=T68)ym0c,"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field><value name="TEXT"><shadow type="text" id=":2KS40/T{+k0;B};A!GC"><field name="TEXT">abc</field></shadow><block type="text" id="/y05rgmIDFLZA}#xxlgv"><field name="TEXT"></field></block></value></block></value><next><block type="text_print" id="J*UC:x]-V)fskW[Zc%+3"><value name="TEXT"><shadow type="text" id="|lJ#M01l)l23rDqofTv+"><field name="TEXT">abc</field></shadow><block type="text_join" id="ZW35WG;*5PB1\`))lg%20"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="Wb}{BeM|4e8E[dn62MdA"><field name="TEXT">Hola </field></block></value><value name="ADD1"><block type="variables_get" id="CCuXuzW.4oOa)an|r)g4"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field></block></value></block></value></block></next></block></statement></block></next></block></xml>`;
    }

    let xml_example = Blockly.Xml.textToDom(xml_example_text);

    //insertar código base en el workspace
    Blockly.Xml.domToWorkspace(xml_example, this.workspace);

    //ejemplo de generador de código
    Blockly.Python.addReservedWords("code");

    Blockly.svgResize(this.workspace);
  }

  /**
   * Inserta los bloques personalizados al workspace de trabajo
   */
  createBlocksCustomized() {
    Blockly.Blocks["prompt_for"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Prompt variable of ")
          .appendField(
            new Blockly.FieldDropdown([
              ["Integer", "Integer"],
              ["Double", "Double"],
              ["String", "String"],
              ["Character", "Character"],
              ["Boolean", "Boolean"],
            ]),
            "Data type"
          )
          .appendField("type");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(285);
        this.setTooltip("");
        this.setHelpUrl("https://www.w3schools.com/jsref/met_win_prompt.asp");
      },
    };

    Blockly.Blocks["create_variable"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Declare")
          .appendField(
            new Blockly.FieldDropdown([
              ["Integer", "Integer"],
              ["Double", "Double"],
              ["Text", "Text"],
              ["Character", "Boolean"],
              ["Boolean", "Boolean"],
            ]),
            "NAME"
          )
          .appendField("Variable");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      },
    };

    Blockly.Blocks["print"] = {
      init: function () {
        this.appendValueInput("TEXT").setCheck(null).appendField("Imprimir");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("Imprimir");
        this.setHelpUrl("");
      },
    };
  }

  /**
   * Crea los generadores a código fuente personalizados
   */
  createGeneratorCodes() {
    Blockly.JavaScript["print"] = function (block) {
      var msg =
        Blockly.JavaScript.valueToCode(
          block,
          "TEXT",
          Blockly.JavaScript.ORDER_NONE
        ) || "''";
      // var code = 'console.log('+msg+')';
      //  if(msg === undefined) msg = ""
      var code = `document.getElementById('output').innerText = document.getElementById('output').innerText + ${msg};\n`;
      return code;
    };
  }

  //metodos para exportar a svg

  svg() {
    var canvas = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
    if (canvas.children[0] === undefined) throw "Couldn't find Blockly canvas";

    canvas.removeAttribute("transform");

    var css =
      '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' +
      Blockly.Css.CONTENT.join("") +
      "]]></style></defs>";
    var bbox = document
      .getElementsByClassName("blocklyBlockCanvas")[0]
      .getBBox();
    var content = new XMLSerializer().serializeToString(canvas);

    var xml =
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
      bbox.width +
      '" height="' +
      bbox.height +
      '" viewBox=" ' +
      bbox.x +
      " " +
      bbox.y +
      " " +
      bbox.width +
      " " +
      bbox.height +
      '">' +
      css +
      '">' +
      content +
      "</svg>";

    return new Blob([xml], { type: "image/svg+xml;base64" });
  }

  exportSVG() {
    var DOMURL = self.URL || self.webkitURL || self;
    this.download(DOMURL.createObjectURL(this.svg()), "blocks.svg");
  }

  generateSVG() {
    var DOMURL = self.URL || self.webkitURL || self;
    var url = DOMURL.createObjectURL(this.svg());
    return url;
  }

  download(url, filename) {
    let element = document.createElement("a");
    element.href = url;
    element.download = filename;
    element.click();
    var DOMURL = self.URL || self.webkitURL || self;
    DOMURL.revokeObjectURL(element.href);
  }
}
