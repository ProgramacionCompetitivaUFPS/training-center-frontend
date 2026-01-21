/**
 * MESSAGES
 * Archivo con todos los mensajes de alerta, exito, error o peligro que se muestran en la aplicación.
 * IMPORTANTE: Cualquier nuevo mensaje que se desee agregar debe incluirse a través de este archivo.
 * @exports MESSAGES - Objeto JSON con todos los mensajes
 */
export let MESSAGES = {

  createMessage : (text, type) => {
    const message = {
      "text": text,
      "type": type
    }
    return message
  },

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
  passwordUpdated: {
    text: 'La contraseña ha sido actualizada exitosamente.',
    type: 'success'
  },
  profileUpdated: {
    text: 'Sus datos se han actualizado exitosamente.',
    type: 'success'
  },
  incorrectPassword: {
    text: 'La contraseña actual es incorrecta.',
    type: 'error'
  },
  superUserWrongData: {
    text: 'Hay un error en datos. Verifícalos y vuelve a intentarlo',
    type: 'error'
  },
  superUserCreated: {
    text: 'El usuario se ha creado correctamente, y ya puede iniciar sesión',
    type: 'success'
  },
  usernameInvalid: {
    text: 'El nombre de usuario debe tener entre 6 y 30 caracteres',
    type: 'error'
  },
  noInstitution: {
    text: 'Debe seleccionar una institucion educativa',
    type: 'error'
  },
  emailNoInstitu: {
    text: 'El correo electrónico escrito no es institucional',
    type: 'error'
  },
  emailInvalid: {
    text: 'El correo electrónico escrito no es válido',
    type: 'error'
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
  problemsEmpty: {
    text: 'Actualmente no hay problemas almacenados en la plataforma',
    type: 'warning'
  },
  problemsSubmissionsEmpty: {
    text: 'Actualmente no hay envios relacionados al problema en la plataforma',
    type: 'warning'
  },
  submittedSolution: {
    text: 'Su solución se ha enviado para ser calificada. En breve recibirá una notificación con la calificación',
    type: 'success'
  },
  invalidCode: {
    text: 'Seleccione un archivo válido con el código fuente de su solución',
    type: 'error'
  },
  invalidJavaClassname: {
    text: 'En java la clase debe ser publica y llamarse Main: \'public class Main\'',
    type: 'error'
  },
  invalidLanguagee: {
    text: 'Seleccione un lenguaje válido',
    type: 'error'
  },
  // Material
  materialDoesNotExists: {
    text: 'El material solicitado no existe',
    type: 'error'
  },
  addedMaterial: {
    text: 'Material añadido exitosamente',
    type: 'success'
  },
  materialsEmpty: {
    text: 'Actualmente, no hay materiales en esta categoría',
    type: 'warning'
  },
  materialRemoved: {
    text: 'El material se ha eliminado correctamente',
    type: 'success'
  },
  materialApproved: {
    text: 'El material seleccionado ha sido aprobado',
    type: 'success'
  },
  materialDeleted: {
    text: 'El material seleccionado ha sido eliminado',
    type: 'success'
  },
  invalidIdMaterial: {
    text: 'La lista de materiales debe contener solo los id de los problemas a añadir, separada por comas',
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
  sessionExpired: {
    text: 'Su sesión ha expirado. Para seguir utilizando la plataforma, vuelva a iniciar sesión',
    type: 'error'
  },
  temporarilyDisabled: {
    text: 'Esta funcionalidad está temporalmente deshabilitada.',
    type: 'error'
  },
  // SYLLABUS
  syllabusesEmpty: {
    text: 'No existe ninguna clase actualmente almacenada',
    type: 'warning'
  },
  syllabusKeyNeeded: {
    text: 'Las clases privadas deben contener una clave.',
    type: 'error'
  },
  syllabusCreated: {
    text: 'La clase ha sido creada correctamente',
    type: 'success'
  },
  syllabusEdited: {
    text: 'La clase ha sido modificada correctamente',
    type: 'success'
  },
  syllabusRemoved: {
    text: 'La clase ha sido eliminada satisfactoriamente',
    type: 'success'
  },
  syllabusUnenroll: {
    text: 'Has sido desmatriculado de esta clase exitosamente',
    type: 'success'
  },
  enrolledInSyllabus: {
    text: 'Se ha registrado satisfactoriamente',
    type: 'success'
  },
  userDeletedSyllabus: {
    text: 'Se ha eliminado el usuario correctamente',
    type: 'success'
  },
  assignmentInvalidProblems: {
    text: 'La lista de problemas debe contener solo los id de los problemas a añadir, separada por comas',
    type: 'error'
  },
  assignmentCreated: {
    text: 'La tarea ha sido creada con éxito',
    type: 'success'
  },
  assignmentModified: {
    text: 'La tarea ha sido modificada con éxito',
    type: 'success'
  },
  // Contests
  contestCreated: {
    text: 'La maratón ha sido creada con éxito',
    type: 'success'
  },
  contestUpdated: {
    text: 'La maratón ha sido actualizada con éxito',
    type: 'success'
  },
  contestError: {
    text: 'Hay un error en la información. Verifica que la fecha y hora de inicio sea futura, que la duración sea de al menos 30 minutos y los datos estén completos',
    type: 'error'
  },
  contestProblemsNotRegistered: {
    text: 'Solo los usuarios registrados en la maratón pueden ver los problemas',
    type: 'warning'
  },
  contestBoardNotRegistered: {
    text: 'Solo los usuarios registrados en la maratón pueden ver los resultados',
    type: 'warning'
  },
  contestFinished: {
    text: 'La competencia ha finalizado',
    type: 'warning'
  },
  invalidIdProblem: {
    text: 'La lista de problemas debe contener solo los id de los problemas a añadir, separada por comas',
    type: 'error'
  },
  contestErrorRegister: {
    text: 'No se ha podido registrar. Verifique que la maratón no haya terminado, y en caso de ser privada, que su clave sea correcta.',
    type: 'error'
  },
  contestRegistered: {
    text: 'Se ha registrado exitosamente.',
    type: 'success'
  },
  contestUnregistered: {
    text: 'Has salido de la maratón.',
    type: 'success'
  },
  contestNotStarted: {
    text: 'No puedes ver esta sección antes de iniciar la competencia.',
    type: 'warning'
  },
  problemsAdded: {
    text: 'Problemas añadidos correctamente.',
    type: 'success'
  },
  userDeleted: {
    text: 'El usuario ha sido eliminado correctamente',
    type: 'success'
  }

}
