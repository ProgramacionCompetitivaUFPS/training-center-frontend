/**
 * Tooltip (Custom Attribute)
 * Permite utilizar la funcionalidad tooltip de bootstrap
 */
export class TooltipCustomAttribute {
  /**
   * Realiza la inyección de dependencias en la clase.
   * @return array con las dependencias: Element, el elemento al cual se aplicará el atributo.
   */
  static inject () {
    return [Element]
  }

  /**
   * Crea una instancia de TooltipCustomAttribute
   * @param {Element} element - Elemento en el que se adaptará el atributo.
   */
  constructor (element) {
    this.element = element
  }

/**
 * Activa el tooltip una vez el elemento ha sido enlazado en la aplicación.
 */
  bind () {
    window.$(this.element).tooltip()
  }

  /**
   * Elimina el tooltip cuado el elemento ha sido desenlazado.
   */
  unbind () {
    window.$(this.element).tooltip('destroy')
  }
}
