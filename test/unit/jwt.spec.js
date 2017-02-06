import { Jwt } from 'services/jwt'
import { API } from 'config/config'

describe('El servicio de JSON Web Tokens JWT: Constructor', () => {
  // Para que este set de pruebas sea exitoso se requiere que el token almacenado en tokenTest
  // Coincida con los datos almacenados en data, pero codificado en formato JWT
  let tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoiZ2Vyc29ubGF6YXJvIiwidXNlcnR5cGUiOiIwIiwiaWF0IjoxNDg1NTU3MDIwLCJleHAiOjE0ODU4MTYyMjB9.l0jNpxcN1ql2651uaYIfDBsVbRvcwkaM8PyBmT0t9PI'
  let data = {
    'sub': 4,
    'username': 'gersonlazaro',
    'usertype': '0',
    'iat': 1485557020,
    'exp': 1485816220
  }
  let jwtService

  it('Inicializa correctamente la información codificada leyendo el token desde el localStorage', () => {
    window.localStorage.setItem(API.tokenName, tokenTest)
    jwtService = new Jwt()
    expect(jwtService.data).toEqual(data)
  })

  it('Inicializa sin token almacenado, con datos nulos', () => {
    jwtService = new Jwt()
    expect(jwtService.data).toBeNull()
  })

  it('Guarda un token nuevo en el sistema y en el almacenamiento e inicializa la información codificada en el', () => {
    jwtService = new Jwt()
    expect(jwtService.data).toBeNull()
    jwtService.save(tokenTest)
    expect(jwtService.data).toEqual(data)
    expect(window.localStorage.getItem(API.tokenName)).toEqual(tokenTest)
  })

  it('Elimina el token del sistema y del almacenamiento correctamente', () => {
    window.localStorage.setItem(API.tokenName, tokenTest)
    jwtService = new Jwt()
    expect(jwtService.data).toEqual(data)
    jwtService.remove()
    expect(jwtService.data).toBeNull()
    expect(window.localStorage.getItem(API.tokenName)).toBeNull()
  })

  it('tokenExists() retorna true cuando hay un token en el sistema', () => {
    window.localStorage.setItem(API.tokenName, tokenTest)
    jwtService = new Jwt()
    expect(jwtService.tokenExists()).toBeTruthy()
  })

  it('tokenExists() retorna false cuando no hay un token en el sistema', () => {
    jwtService = new Jwt()
    expect(jwtService.tokenExists()).toBeFalsy()
  })

  it('Retorna correctamente el username codificado en el token', () => {
    window.localStorage.setItem(API.tokenName, tokenTest)
    jwtService = new Jwt()
    expect(jwtService.getUsername()).toEqual(data.username)
  })

  it('Retorna correctamente el userId codificado en el token', () => {
    window.localStorage.setItem(API.tokenName, tokenTest)
    jwtService = new Jwt()
    expect(jwtService.getUserId()).toEqual(data.sub)
  })

  it('Retorna correctamente el tipo de usuario', () => {
    jwtService = new Jwt()
    expect(jwtService.getUserType()).toEqual('visitor')
    jwtService.save(tokenTest)
    expect(jwtService.getUserType()).toEqual('student')
  })

  afterEach(() => {
    window.localStorage.clear()
  })
})
