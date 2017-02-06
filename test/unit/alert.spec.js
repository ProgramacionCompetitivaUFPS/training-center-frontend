import { Alert } from 'services/services'
import { NotificationService } from 'aurelia-notify'

describe('El servicio de notificaciones (alert)', () => {
  let notificationService = new NotificationService()
  let alertService

  beforeEach(() => {
    alertService = new Alert(notificationService)
  })

  it('Invoca una notificación de error cuando el mensaje contiene type = error', () => {
    spyOn(alertService.notificationService, 'danger').and.callFake(function(text){})
    let msg = {
      text: 'Prueba unitaria',
      type: 'error'
    }
    alertService.showMessage(msg)
    expect(alertService.notificationService.danger).toHaveBeenCalledWith(msg.text)
  })

  it('Invoca una notificación de éxito cuando el mensaje contiene type = success', () => {
    spyOn(alertService.notificationService, 'success')
    let msg = {
      text: 'Prueba unitaria',
      type: 'success'
    }
    alertService.showMessage(msg)
    expect(alertService.notificationService.success).toHaveBeenCalledWith(msg.text)
  })

  it('Invoca una notificación de warning cuando el mensaje contiene type = warning', () => {
    spyOn(alertService.notificationService, 'warning')
    let msg = {
      text: 'Prueba unitaria',
      type: 'warning'
    }
    alertService.showMessage(msg)
    expect(alertService.notificationService.warning).toHaveBeenCalledWith(msg.text)
  })

  it('Invoca una notificación informativa cuando el mensaje contiene type = info', () => {
    spyOn(alertService.notificationService, 'info')
    let msg = {
      text: 'Prueba unitaria',
      type: 'info'
    }
    alertService.showMessage(msg)
    expect(alertService.notificationService.info).toHaveBeenCalledWith(msg.text)
  })
})