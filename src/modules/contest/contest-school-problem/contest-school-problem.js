import { inject, observable } from "aurelia-framework";

import { Router } from "aurelia-router";
import { MESSAGES, SETTINGS } from "config/config";
import { Contest, Problem, Enums } from "models/models";
import { Alert, Auth, Contests, Problems } from "services/services";
import * as Es from "blockly/msg/es";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/python";
import "blockly/javascript";

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de problemas (Problems), servicio de enrutamiento (Router)
@inject(Alert, Auth, Contests, Problems, Router)
export class ContestProblem {
  @observable now;
  @observable dateLoaded;
  @observable contestLoaded;

  /**
   * Crea una instancia de ViewProblem.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de problemas
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor(
    alertService,
    authService,
    contestService,
    problemService,
    routerService
  ) {
    this.alertService = alertService;
    this.authService = authService;
    this.problemService = problemService;
    this.contestService = contestService;
    this.routerService = routerService;
    this.languages = SETTINGS.languages;
    this.sourceValid = false;
    this.code;
    this.creatorId = 0;
    this.status = "registered";
    this.validDate = 0; // 0 => Valid, 1 => Prox, 2 => Pasada
    this.contTime = {};
    this.files = {};
    this.sourceValid = false;
    this.enums = Enums;
  }

  attached() {
    this.configureBlockly();
  }

  configureBlockly(){
    //traducir Blockly a español
    Blockly.setLocale(Es);

    //configuracion general del tablero de blockly
    var options = {
      toolbox: this.contestWorkspaceBlocks,
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

    this.contestWorkspace = Blockly.inject(this.blocklyDiv, options);

    //Agregar bloques personalizados
    this.createBlocksCustomized();
    this.createGeneratorCodes();

    Blockly.Xml.domToWorkspace(
      this.contestWorkspaceBlocks,
      this.contestWorkspace
    );

    var xml_example_text;

    if (sessionStorage.getItem("xmlCode")) {
      xml_example_text = sessionStorage.getItem("xmlCode");
    } else {
      //blockly Hello World
      xml_example_text = `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="XU)j],aCx_e_I540dPH#">count</variable><variable id="3.hwej-DXj0icz|?W?zz">nombre</variable></variables><block type="variables_set" id="7%E0I.MW\`f5W6MNTP@:" x="-486" y="67"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field><value name="VALUE"><block type="text_prompt_ext" id=")y/c|+john+o$,^+{z(u"><mutation type="NUMBER"></mutation><field name="TYPE">NUMBER</field><value name="TEXT"><shadow type="text" id="u|OniKM+4Z2H~ZV%ckoF"><field name="TEXT">abc</field></shadow><block type="text" id="-@[e5C!*Zvnjdw3G[0UM"><field name="TEXT"></field></block></value></block></value><next><block type="controls_repeat_ext" id="[}I#LS9,s)XnA3Eb=M]Y"><value name="TIMES"><shadow type="math_number" id="N\`SKYlg3HwRr[,Ob!2UR"><field name="NUM">10</field></shadow><block type="variables_get" id="bY@qGOu1|74ihzKD}!hU"><field name="VAR" id="XU)j],aCx_e_I540dPH#">count</field></block></value><statement name="DO"><block type="variables_set" id="Rm{^L#^}lKztw2?t7YQ|"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field><value name="VALUE"><block type="text_prompt_ext" id="pVqk5E@o;Q=T68)ym0c,"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field><value name="TEXT"><shadow type="text" id=":2KS40/T{+k0;B};A!GC"><field name="TEXT">abc</field></shadow><block type="text" id="/y05rgmIDFLZA}#xxlgv"><field name="TEXT"></field></block></value></block></value><next><block type="text_print" id="J*UC:x]-V)fskW[Zc%+3"><value name="TEXT"><shadow type="text" id="|lJ#M01l)l23rDqofTv+"><field name="TEXT">abc</field></shadow><block type="text_join" id="ZW35WG;*5PB1\`))lg%20"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="Wb}{BeM|4e8E[dn62MdA"><field name="TEXT">Hola </field></block></value><value name="ADD1"><block type="variables_get" id="CCuXuzW.4oOa)an|r)g4"><field name="VAR" id="3.hwej-DXj0icz|?W?zz">nombre</field></block></value></block></value></block></next></block></statement></block></next></block></xml>`;
    }

    let xml_example = Blockly.Xml.textToDom(xml_example_text);

    //insertar código base en el workspace
    Blockly.Xml.domToWorkspace(xml_example, this.contestWorkspace);
    //ejemplo de generador de código
    Blockly.Python.addReservedWords("code");
    Blockly.svgResize(this.contestWorkspace);
  }

  /**
   * Crea los generadores a código fuente personalizados
   */
  createGeneratorCodes() {
     /*
      Convertir float a entero (Python)
    */
      Blockly.Python['convert_to_int'] = function(block) {
        var numberConvert = Blockly.Python.valueToCode(block, 'numverConvert', Blockly.Python.ORDER_ATOMIC);
        // TODO: Assemble Python into code variable.
        var code = `int(${numberConvert})`;
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.Python.ORDER_NONE];
      };
  }

  /**
   * Inserta los bloques personalizados al workspace de trabajo
   */
  createBlocksCustomized() {
    Blockly.Blocks['convert_to_int'] = {
      init: function() {
        this.appendValueInput("numverConvert")
            .setCheck("Number")
            .appendField("Convertir a entero");
        this.setInputsInline(false);
        this.setOutput(true, "Int");
        this.setColour(230);
     this.setTooltip("Convertir a número entero");
     this.setHelpUrl("");
      }
    };
  }

  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.contestId = params.id;
    this.contestProblemId = params.contestProblemId;
    this.id = params.problemId;
    this.lang = params.lang || "en";

    //validar redireccion problemas de categoría diferente
    this.problemService
      .validateTypeCategory(this.id)
      .then((dataCategory) => {
        if (dataCategory.type !== this.enums.typeCategory.school) {
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
    this.validDate = -1; // 0 => Valid, 1 => Prox, 2 => Pasada
    this.getContest();
  }

  contestLoadedChanged(act, prev) {
    this.validateDate();
  }
  dateLoadedChanged(act, prev) {
    this.validateDate();
  }

  validateDate() {
    if (this.contestLoaded && this.dateLoaded) {
      if (this.now < this.startDate) {
        this.routerService.navigateToRoute("detail", { id: this.contestId });
        this.alertService.showMessage(MESSAGES.contestNotStarted);
      } else {
        this.getStatus();
        this.validateSpecificDate();
      }
    }
  }

  /**
   * //extraer fuente de código de Blockly, y prepararlo para evaluar
   * @returns
   */
  processSources() {
    // Extraer xml del código en un tablero
    var xml = Blockly.Xml.workspaceToDom(this.contestWorkspace);

    //convertir xml a texto plano
    var xml_text = Blockly.Xml.domToText(xml);

    // convertir texto plano a xml
    //el xml se puede usar para redibujar el código en caso de recargar página
    var xml_source = Blockly.Xml.textToDom(xml_text);

    //guardar fuente de blockly para usarlo en proximos envíos
    sessionStorage.setItem("xmlCode", xml_text);

    //convertir fuente de blockly a código ejecutable
    const pythonCode = Blockly.Python.workspaceToCode(this.contestWorkspace);

    //generar imagen para nueva submission
    const urlSVG = this.generateSVG();

    return {
      pythonCode,
      xml,
      urlSVG,
    };
  }

  /**
   * Preparar archivo .py, .XML y svg a partir de blockly toolbox
   */
  preSubmit() {
    let endDate = new Date(this.contest.endDate);
    if (this.language === null) {
      this.alertService.showMessage(MESSAGES.invalidLanguage);
    } else if (this.now > endDate) {
      this.alertService.showMessage(MESSAGES.contestFinished);
    } else {
      const sources = this.processSources();
      this.code = new File([sources.pythonCode], "main.py", {
        type: "text/x-python",
      });
      const XML = new File([sources.xml], "main.xml", {
        type: "text/xml",
      });

      this.files.codeFile = this.code;
      this.files.xmlBlocklyFile = XML;
      this.language = "Blockly";

      this.createFileSvg(sources.urlSVG, "blocks.svg");
    }
  }

  /**
   * Convertir submmision de blockly a formato SVG para mostrar en mis envíos
   * @param {*} url
   * @param {*} filename
   */
  createFileSvg(url, filename) {
    fetch(url)
      .then((response) => {
        response.blob().then((data) => {
          let metadata = {
            type: "image/svg+xml",
          };
          let file = new File([data], filename, metadata);
          this.files.svgBlocklyCode = file;
          this.submit();
        });
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

  validateSpecificDate() {
    setInterval(() => {
      if (this.now < this.startDate) {
        this.validDate = 1;
      } else if (this.now > this.endDate) {
        this.validDate = 2;
      } else {
        this.validDate = 0;
      }
    }, 1000);
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
        this.code[0].type.startsWith("text/") ||
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

  submit() {
    this.problemService
      .submitSolution(
        this.id,
        this.language,
        undefined,
        this.contestProblemId,
        this.files
      )
      .then(() => {
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

  /**
   * Obtiene el estado actual del estudiante en una maratón.
   */
  getStatus() {
    this.contestService
      .getStatus(this.contestId, this.authService.getUserId())
      .then((data) => {
        this.status = data.status;
        if (
          this.status !== "registered" &&
          this.authService.getUserId() !== this.creatorId &&
          !this.contest.privacy
        ) {
          this.routerService.navigateToRoute("detail", { id: this.contestId });
          this.alertService.showMessage(MESSAGES.contestProblemsNotRegistered);
        } else {
          this.getProblem();
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError);
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
  }

  /**
   * Obtiene la información de la maratón actual.
   */
  getContest() {
    this.contestService
      .getContest(this.contestId)
      .then((data) => {
        this.contest = new Contest(
          data.contest.title,
          data.contest.description,
          data.contest.init_date,
          data.contest.end_date,
          data.contest.rules,
          data.contest.public,
          null,
          this.contestId
        );
        this.startDate = new Date(data.contest.init_date);
        this.endDate = new Date(data.contest.end_date);
        this.contestLoaded = true;
        this.creatorId = data.contest.user.id;
      })
      .catch((error) => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError);
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
  }

  getProblem() {
    this.problemService
      .getProblem(this.id)
      .then((problem) => {
        problem = problem.problem;
        this.problem = new Problem(
          parseInt(this.id),
          problem.title_en,
          problem.title_es,
          parseInt(problem.level),
          parseInt(problem.category),
          undefined,
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
   * Crear SVG del código de blockly
   * @returns 
   */
     svg() {
      var canvas = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
      if (canvas.children[0] === undefined) throw "Couldn't find Blockly canvas";
  
      canvas.removeAttribute("transform");
  
      var css =
        '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml">' +
        "<![CDATA[" +
        `rect {
          height: 0;
        }
        .blocklyDropdownText{
          font-weight: bold;
        }
        ` +
        "color: blue;" +
        "]]></style></defs>";
      var bbox = document
        .getElementsByClassName("blocklyBlockCanvas")[0]
        .getBBox();
      //bbox.style.color = 'blue';
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
  
    generateSVG() {
      var DOMURL = self.URL || self.webkitURL || self;
      var url = DOMURL.createObjectURL(this.svg());
      return url;
    }
}
