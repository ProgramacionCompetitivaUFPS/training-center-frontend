/**
 * Material (Model)
 * Modelo de material.
 * @export
 * @class Material
 */
export class Material {
  /**
   * Crea una instancia de Material
   * @param {Number} id - Identificador del material
   * @param {String} name - Nombre del material
   * @param {Number} category - Id de la categoría
   * @param {String} description - Texto descriptivo del material
   * @param {Bool} isPdf - True si el material es un pdf, falso si es una URL
   * @param {String} url - Link con la dirección del material
   * @param {Strng} cateogryString - string con la categoría
   */
  constructor (id = undefined, name = undefined, category = undefined, description = undefined, isPdf = false, url = undefined, pdf = undefined, categoryString = undefined) {
    this.id = id
    this.name = name
    this.category = category
    this.description = description
    this.isPdf = isPdf
    this.url = url
    this.pdf = pdf
    this.categoryString = categoryString
  }
}
