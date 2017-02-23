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
    this.inputValid = false
    this.outputValid = false
  }

  created () {
    this.getCategories()
  }

  attached () {
    window.$(document).ready(function () {
      window.$('body').tooltip({ selector: '[data-toggle=tooltip]' })
    })
    this.editor = new window.SimpleMDE(
      {
        autoDownloadFontAwesome: false,
        autofocus: false,
        autosave: {
          delay: 1000,
          enabled: true,
          uniqueId: 'problem-editor'
        },
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
          }

        ]
      }
    )
  }

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

  validateTestCase (type) {
    let domElement
    if (type === 'input') {
      domElement = document.getElementById('input-file')
      this.inputValid = false
    } else if (type === 'output') {
      domElement = document.getElementById('output-file')
      this.inputValid = false
    }
    if (domElement.files.length !== 0) {
      let name = domElement.files[0].name
      let extension = name.split('.')
      extension = extension[extension.length - 1]
      if (extension === 'txt' || extension === 'in') {
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
}
