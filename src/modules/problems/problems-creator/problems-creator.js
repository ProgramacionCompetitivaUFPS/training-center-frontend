import { MESSAGES } from 'config/config'
import { Problem } from 'models/models'
import { Alert, Problems } from 'services/services'

export class ProblemsCreator {

  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * Servicio de Autenticación (Auth) y Servicio de obtención y manejo de problemas (Problems)
   */
  static inject () {
    return [Alert, Problems]
  }

  /**
   * Crea una instancia de ProblemsCreator.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} problemService - Servicio de obtención y manejo de problemas
   */
  constructor (alertService, problemsService) {
    this.alertService = alertService
    this.problemsService = problemsService
    this.categories = []
    this.newProblem = new Problem()
    this.newProblem.timeLimit = 1
    this.newProblem.level = 1
    this.inputValid = false
    this.outputValid = false
    this.originalLanguage = 'es'
    this.doubleLanguage = false
    this.templateSpanish = '# Descripción\n\nReemplaza este texto con la descripción de tu problema. Recuerda que puedes usar la sintaxis de Markdown.\n\n# Entradas\n\nReemplaza este texto con la especificación de la entrada de tu problema. Si no conoces la sintaxis markdown, puedes hacer uso de las opciones de la barra superior.\n\n# Salidas\n\nReemplaza este texto con la especificación de la salida de tu problema.'
    this.templateEnglish = '# Description\n\nReplace this text with the description of your problem. Remember that you can use the Markdown syntax.\n\n# Inputs\n\nReplace this text with the specification of the input of your problem. If you do not know the markdown syntax, you can use the options in the top bar.\n\n# Outputs\n\nReplace this text with the specification of the output of your problem.'
  }

  /**
   * Obtiene las categorías para desplegarse en la vista. Este método hace parte
   * del ciclo de vida de la aplicación y se ejecuta en el instante en que se conecta el
   * componente es creado.
   */
  created () {
    this.getCategories()
  }

  /**
   * Activa los tooltips y crea los editores según corresponda.
   * Este método hace parte del ciclo de vida de la aplicación y se ejecuta en el instante
   * en que se conecta el componente con el view-model.
   */
  attached () {
    window.$(document).ready(function () {
      window.$('body').tooltip({ selector: '[data-toggle=tooltip]' })
    })
    this.createFirstEditor()
    if (this.doubleLanguage) {
      this.createSecondEditor()
    }
  }

  /**
   * Obtiene las categorías desde el servidor y las incorpora en el atributo categories,
   * el cual se despliega en un select para la selección del usuario.
   */
  getCategories () {
    this.problemsService.getCategories()
      .then(data => {
        this.categories = data
      })
      .catch(error => {
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.categoriesError)
        }
      })
  }

  /**
   * Valida que el caso de prueba, bien sea de entrada o de salida, contiene una extensión
   * válida (.txt, .in o .out).
   * @param {string} type - Indica si se trata de un caso de entrada (input) o de salida (output)
   */
  validateTestCase (type) {
    let domElement
    if (type === 'input') {
      domElement = document.getElementById('input-file')
      this.inputValid = false
    } else if (type === 'output') {
      domElement = document.getElementById('output-file')
      this.outputValid = false
    }
    if (domElement.files.length !== 0) {
      let name = domElement.files[0].name
      let extension = name.split('.')
      extension = extension[extension.length - 1]
      if (extension === 'txt' || extension === 'in' || extension === 'out') {
        if (type === 'input') {
          this.inputValid = true
        } else if (type === 'output') {
          this.outputValid = true
        }
      } else {
        this.alertService.showMessage(MESSAGES.fileTypeIsNotTxtOrIn)
      }
    }
  }

  /**
   * Cambia el lenguaje de la plantilla del problema por defecto en el editor primario.
   */
  changeLanguageEditor () {
    if (this.originalLanguage === 'es') {
      this.editor.value(this.templateSpanish)
    } else {
      this.editor.value(this.templateEnglish)
    }
  }

  /**
   * Cambia el lenguaje de la plantilla del problema por defecto en el editor secundario.
   */
  changeLanguageSecondEditor () {
    if (this.originalLanguage === 'en') {
      this.secondEditor.value(this.templateSpanish)
    } else {
      this.secondEditor.value(this.templateEnglish)
    }
  }

  /**
   * Añade un nuevo lenguaje al problema que está siendo añadido.
   */
  addLanguage () {
    this.doubleLanguage = true
    this.createSecondEditor()
    this.changeLanguageSecondEditor()
  }

  /**
   * Elimina el segundo lenguaje del problema que está siendo añadido.
   */
  removeLanguage () {
    this.doubleLanguage = false
    this.secondEditor.toTextArea()
    this.secondEditor = null
  }

  /**
   * Inicializa el editor principal del creador de problemas.
   */
  createFirstEditor () {
    this.editor = new window.SimpleMDE(
      {
        autoDownloadFontAwesome: false,
        autofocus: false,
        element: document.getElementById('md-editor'),
        spellChecker: false,
        status: false,
        toolbar: [
          {
            name: 'bold',
            action: window.SimpleMDE.toggleBold,
            className: 'glyphicon glyphicon-bold',
            title: 'Negrilla'
          },
          {
            name: 'italic',
            action: window.SimpleMDE.toggleItalic,
            className: 'glyphicon glyphicon-italic',
            title: 'Cursiva'
          },
          '|',
          {
            name: 'heading',
            action: window.SimpleMDE.toggleHeadingSmaller,
            className: 'glyphicon glyphicon-header',
            title: 'Título (Pulsa varias veces para cambiar tamaño)'
          },
          {
            name: 'quote',
            action: window.SimpleMDE.toggleBlockquote,
            className: 'glyphicon glyphicon-bookmark',
            title: 'Cita'
          },
          {
            name: 'unordered-list',
            action: window.SimpleMDE.toggleUnorderedList,
            className: 'glyphicon glyphicon-th-list',
            title: 'Lista'
          },
          {
            name: 'ordered-list',
            action: window.SimpleMDE.toggleOrderedList,
            className: 'glyphicon glyphicon-list-alt',
            title: 'Lista numerada'
          },
          '|',
          {
            name: 'link',
            action: window.SimpleMDE.drawLink,
            className: 'glyphicon glyphicon-link',
            title: 'Insertar enlace'
          },
          {
            name: 'image',
            action: window.SimpleMDE.drawImage,
            className: 'glyphicon glyphicon-picture',
            title: 'Insertar imagen'
          },
          {
            name: 'code',
            action: window.SimpleMDE.toggleCodeBlock,
            className: 'glyphicon glyphicon-console',
            title: 'Insertar código'
          },
          '|',
          {
            name: 'preview',
            action: window.SimpleMDE.togglePreview,
            className: 'glyphicon glyphicon-eye-open no-disable',
            title: 'Vista previa'
          },
          {
            name: 'side-by-side',
            action: window.SimpleMDE.toggleSideBySide,
            className: 'glyphicon glyphicon-adjust no-disable no-mobile',
            title: 'Dividir Pantalla'
          },
          {
            name: 'fullscreen',
            action: window.SimpleMDE.toggleFullScreen,
            className: 'glyphicon glyphicon-fullscreen no-disable no-mobile',
            title: 'Pantalla Completa'
          },
          '|',
          {
            name: 'custom',
            action: function customFunction (editor) {
              window.$('#markdown-help').modal('show')
            },
            className: 'glyphicon glyphicon-question-sign',
            title: 'Guía de Markdown'
          }

        ]
      }
    )
  }

  /**
   * Inicializa el editor secundario del creador de problemas.
   */
  createSecondEditor () {
    this.secondEditor = new window.SimpleMDE(
      {
        autoDownloadFontAwesome: false,
        autofocus: false,
        element: document.getElementById('md-editor-2'),
        spellChecker: false,
        status: false,
        toolbar: [
          {
            name: 'bold',
            action: window.SimpleMDE.toggleBold,
            className: 'glyphicon glyphicon-bold',
            title: 'Negrilla'
          },
          {
            name: 'italic',
            action: window.SimpleMDE.toggleItalic,
            className: 'glyphicon glyphicon-italic',
            title: 'Cursiva'
          },
          '|',
          {
            name: 'heading',
            action: window.SimpleMDE.toggleHeadingSmaller,
            className: 'glyphicon glyphicon-header',
            title: 'Título (Pulsa varias veces para cambiar tamaño)'
          },
          {
            name: 'quote',
            action: window.SimpleMDE.toggleBlockquote,
            className: 'glyphicon glyphicon-bookmark',
            title: 'Cita'
          },
          {
            name: 'unordered-list',
            action: window.SimpleMDE.toggleUnorderedList,
            className: 'glyphicon glyphicon-th-list',
            title: 'Lista'
          },
          {
            name: 'ordered-list',
            action: window.SimpleMDE.toggleOrderedList,
            className: 'glyphicon glyphicon-list-alt',
            title: 'Lista numerada'
          },
          '|',
          {
            name: 'link',
            action: window.SimpleMDE.drawLink,
            className: 'glyphicon glyphicon-link',
            title: 'Insertar enlace'
          },
          {
            name: 'image',
            action: window.SimpleMDE.drawImage,
            className: 'glyphicon glyphicon-picture',
            title: 'Insertar imagen'
          },
          {
            name: 'code',
            action: window.SimpleMDE.toggleCodeBlock,
            className: 'glyphicon glyphicon-console',
            title: 'Insertar código'
          },
          '|',
          {
            name: 'preview',
            action: window.SimpleMDE.togglePreview,
            className: 'glyphicon glyphicon-eye-open no-disable',
            title: 'Vista previa'
          },
          {
            name: 'side-by-side',
            action: window.SimpleMDE.toggleSideBySide,
            className: 'glyphicon glyphicon-adjust no-disable no-mobile',
            title: 'Dividir Pantalla'
          },
          {
            name: 'fullscreen',
            action: window.SimpleMDE.toggleFullScreen,
            className: 'glyphicon glyphicon-fullscreen no-disable no-mobile',
            title: 'Pantalla Completa'
          }
        ]
      }
    )
  }

  /**
   * Asigna el texto especificado en los editores de markdown en las variables
   * del objeto newProblem.
   */
  assignDescriptions () {
    if (this.originalLanguage === 'es') {
      this.newProblem.descriptionES = this.editor.value()
      if (this.doubleLanguage) {
        this.newProblem.descriptionEN = this.secondEditor.value()
      }
    } else {
      this.newProblem.descriptionEN = this.editor.value()
      if (this.doubleLanguage) {
        this.newProblem.descriptionES = this.secondEditor.value()
      }
    }
  }

  /**
   * Valida los datos del problema añadido y despliega mensajes de error en caso de
   * haber campos invalidos y/o vacios.
   * @return {boolean} true si la información es válida, false en caso contrario.
   */
  validateInfo () {
    if (typeof (this.newProblem.level) === 'number' && this.newProblem.level >= 1 && this.newProblem.level <= 10 && typeof (this.newProblem.category) === 'number' && this.inputValid && this.outputValid && typeof (this.newProblem.timeLimit) === 'number' && this.newProblem.timeLimit >= 0.5 && this.newProblem.timeLimit <= 10.0) {
      if (this.originalLanguage === 'es') {
        if (typeof (this.newProblem.titleES) === 'string' && this.newProblem.titleES !== '') {
          if (!this.doubleLanguage) {
            return true
          } else if (typeof (this.newProblem.titleEN) === 'string' && this.newProblem.titleEN !== '') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (this.originalLanguage === 'en') {
        if (typeof (this.newProblem.titleEN) === 'string' && this.newProblem.titleEN !== '') {
          if (!this.doubleLanguage) {
            return true
          } else if (typeof (this.newProblem.titleES) === 'string' && this.newProblem.titleES !== '') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    } else {
      if (typeof (this.newProblem.level) === 'number' && (this.newProblem.level < 1 || this.newProblem.level > 10)) {
        this.alertService.showMessage(MESSAGES.wrongLevel)
      } else if (typeof (this.newProblem.timeLimit) === 'number' && (this.newProblem.timeLimit < 0.5 && this.newProblem.timeLimit > 10.0)) {
        this.alertService.showMessage(MESSAGES.wrongTimeLimit)
      } else if (!this.inputValid || !this.outputValid) {
        this.alertService.showMessage(MESSAGES.incompleteIO)
      } else {
        this.alertService.showMessage(MESSAGES.incompleteDataProblem)
      }
      return false
    }
  }

  /**
   * Envia al servidor el problema escrito y despliega mensajes en pantalla según
   * el resultado de la operación.
   */
  submit () {
    this.assignDescriptions()
    if (this.validateInfo()) {
      this.problemsService.createProblem(this.newProblem)
      .then(() => {
        this.alertService.showMessage(MESSAGES.problemSaved)
      })
      .catch(error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else if (error.status === 500) {
          this.alertService.showMessage(MESSAGES.serverError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
    }
  }
}
