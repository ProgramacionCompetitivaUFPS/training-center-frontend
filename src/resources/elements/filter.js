import {bindable, bindingMode} from 'aurelia-framework'

export class Filter {
  // Decorators
  @bindable numberOfItems
  @bindable sortOptions
  @bindable textToShow
  @bindable({defaultBindingMode: bindingMode.twoWay}) filterChange
  @bindable({defaultBindingMode: bindingMode.twoWay}) limit
  @bindable({defaultBindingMode: bindingMode.twoWay}) sort
  @bindable({defaultBindingMode: bindingMode.twoWay}) by
  @bindable languageFlag
  @bindable({defaultBindingMode: bindingMode.twoWay}) language

  languageFlagChanged(act, prev) {console.log(act)}
  /**
   * Establece un nuevo criterio de ordenamiento.
   * @param {String} sort - Criterio de ordenamiento
   */
  setSort (sort) {
    this.sort = sort
    this.filterChange = !this.filterChange
  }

  /**
   * Establece una nueva dirección de ordenamiento.
   * @param {String} sort - Dirección de ordenamiento
   */
  setBy (by) {
    this.by = by
    this.filterChange = !this.filterChange
  }

  /**
   * Establece una nueva cantidad de elementos a mostrar.
   * @param {Number} number - Cantidad de elementos a mostrar.
   */
  setLimit (number) {
    this.limit = number
    this.filterChange = !this.filterChange
  }

  /**
   * Establece el filtro para seleccionar en cualquier idioma, o en uno determinado.
   * @param {string} language - Lenguaje ('Español', 'Inglés' o 'Cualquier Idioma')
   */
  setLanguage (language) {
    this.language = language
    this.filterChange = !this.filterChange
  }
}