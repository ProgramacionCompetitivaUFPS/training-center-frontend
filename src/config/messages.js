/**
 * MESSAGES
 * Archivo con todos los mensajes de alerta, exito, error o peligro que se muestran en la aplicación.
 * IMPORTANTE: Cualquier nuevo mensaje que se desee agregar debe incluirse a través de este archivo.
 * @exports MESSAGES - Objeto JSON con todos los mensajes
 */
export let MESSAGES = {
  // LOGIN
  loginWrongData: {
    text: 'Sus datos no coinciden. Inténtalo de nuevo',
    type: 'error'
  },
  loginIncompleteData: {
    text: 'Ingrese un usuario y contraseña para iniciar sesión',
    type: 'warning'
  },

  // SIGNIN
  signInCorrect: {
    text: 'Su cuenta se ha creado exitosamente.',
    type: 'success'
  },
  signInWrongData: {
    text: 'Hay un error con sus datos. Verifícalos y vuelve a intentarlo',
    type: 'error'
  },
  signInIncompleteData: {
    text: 'Hay campos obligatorios sin llenar. Complétalos para registrar correctamente',
    type: 'warning'
  },
  signInDifferentPasswords: {
    text: 'Las contraseñas no coinciden',
    type: 'warning'
  },

  // RECOVERY
  recoveryEmailSent: {
    text: 'Se ha enviado un mensaje a su correo para proceder a la recuperación de su contraseña',
    type: 'success'
  },
  recoveryMailDoesNotExist: {
    text: 'Este email no ha sido registrado en la plataforma',
    type: 'error'
  },
  recoveryInvalidToken: {
    text: 'Link invalido. Verifique el enlace enviado a su correo, e inténtelo de nuevo',
    type: 'error'
  },
  recoveryExpiredToken: {
    text: 'Su link de recuperación se ha vencido. Solicite un nuevo link para recuperar su contraseña, y uselo en máximo una hora',
    type: 'error'
  },
  recoveryDifferentPasswords: {
    text: 'Las contraseñas no coinciden',
    type: 'warning'
  },
  recoveryCorrect: {
    text: 'Su contraseña se ha cambiado exitosamente',
    type: 'success'
  },
  // CATEGORIAS
  categoriesEmpty: {
    text: 'La lista de categorías no ha sido cargada. Intentelo de nuevo',
    type: 'error'
  },
  categoryDoesNotExist: {
    text: 'No existe una categoría con el id solicitado. Verifique el link, e intentelo de nuevo',
    type: 'error'
  },
  // FILES
  fileTypeIsNotTxt: {
    text: 'El archivo debe ser de tipo .txt, .in o .out',
    type: 'error'
  },

  // PROBLEMS
  categoriesEmpty: {
    text: 'No existe ninguna categoría actualmente almacenada',
    type: 'warning'
  },
  categoryCreated: {
    text: 'La categoría se ha añadido satisfactoriamente',
    type: 'success'
  },
  categoryEdited: {
    text: 'La categoría se ha editado satisfactoriamente',
    type: 'success'
  },
  categoryRemoved: {
    text: 'La categoría ha sido eliminada satisfactoriamente',
    type: 'success'
  },
  problemSaved: {
    text: 'El problema ha sido guardado correctamente',
    type: 'success'
  },
  problemDeleted: {
    text: 'El problema se ha eliminado correctamente',
    type: 'success'
  },
  incompleteDataProblem: {
    text: 'Debes completar todos los campos visibles antes de enviar el problema',
    type: 'error'
  },
  wrongLevel: {
    text: 'La dificultad debe ser un valor entre 1 y 10',
    type: 'error'
  },
  wrongTimeLimit: {
    text: 'El tiempo limite debe ser un valor entre 0.5 y 10 segundos',
    type: 'error'
  },
  incompleteIO: {
    text: 'Debes añadir archivos de entrada y salida para el problema',
    type: 'error'
  },
  // Material
  materialDoesNotExists: {
    text: 'El material solicitado no existe',
    type: 'error'
  },
  // GENERAL
  serverError: {
    text: 'Ha ocurrido un error interno. Lo sentimos. Vuelve a intentarlo mas tarde',
    type: 'error'
  },
  unknownError: {
    text: 'Lo sentimos. Ha ocurrido un error',
    type: 'error'
  },
  permissionsError: {
    text: 'Usted no tiene permisos para realizar esta acción',
    type: 'error'
  },
  // SYLLABUS
  syllabusesEmpty: {
    text: 'No existe ninguna clase actualmente almacenada',
    type: 'warning'
  },
}
