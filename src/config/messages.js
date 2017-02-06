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
  }
}
