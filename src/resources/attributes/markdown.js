import Showdown from 'showdown'
/**
 * Markdown (Custom Attribute)
 * Permite la conversión de markdown a html.
 */
export class MarkdownCustomAttribute {
  /**
   * Realiza la inyección de dependencias en la clase.
   * @return array con las dependencias: Element, el elemento al cual se aplicará el atributo.
   */
  static inject () {
    return [Element]
  }

  /**
   * Crea una instancia de MarkdownCustomAttribute.
   * @param {Element} element - Elemento en el que se adaptará el atributo.
   */
  constructor (element) {
    this.element = element
    this.converter = new Showdown.Converter()
  }

  /**
   * Cuando el valor cambia, activa el conversor para recompilar el markdown a html.
   * @param {string} newValue - nuevo markdown a convertir.
   * @param {string} oldValue - Antiguo markdown.
   */
  valueChanged (newValue, oldValue) {
    this.element.innerHTML = this.converter.makeHtml(
      newValue
        .split('\n')
        .map(line => line.trim())
        .join('\n')
      )
  }
}
