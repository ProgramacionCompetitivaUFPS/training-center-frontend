import { NotificationService } from 'aurelia-notify'
import { Alert, Auth } from 'services/services'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

import { RecoveryPassword } from 'modules/recovery/recovery-password'



describe('El módulo de recuperación de contraseña (Recovery password)', () => {
  let alertService = new Alert(new NotificationService())
  let authService = new Auth(new Http(), new Jwt())
  let recoveryModule

  beforeEach(() => {
    recoveryModule = new RecoveryPassword(alertService, authService)
  })

  it('Inicia con un email vacio', () => {
    expect(recoveryModule.email).toEqual('')
  })

  it('Si el campo email es vacio impide el envio al servicio de recuperación', () => {
    spyOn(recoveryModule.authService, 'requestRecovery').and.callThrough()
    recoveryModule.requestRecovery()
    expect(recoveryModule.authService.requestRecovery).not.toHaveBeenCalled()
  })

  it('Si el campo email es válido envia al servicio de recuperación', () => {
    spyOn(recoveryModule.authService, 'requestRecovery').and.callThrough()
    let email = 'user@email.com'
    recoveryModule.email = email
    recoveryModule.requestRecovery()
    expect(recoveryModule.authService.requestRecovery).toHaveBeenCalledWith(email)
  })
})
