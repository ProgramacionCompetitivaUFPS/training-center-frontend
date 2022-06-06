import {bindable, bindingMode} from 'aurelia-framework'

/**
 * Class Paginator (element)
 * Elemento HTML modular para manejar la paginación
 */
export class Paginator {
  // Decorators
  @bindable({defaultBindingMode: bindingMode.twoWay}) page
  @bindable({defaultBindingMode: bindingMode.twoWay}) totalPages

  /**
   * Inicializa un paginador
   */
  constructor () {
    this.pagination = []
  }

  /**
   * Método que se activa cuando totalPages cambia su valor.
   */
  totalPagesChanged() {
    this.setPagination()
  }

  pageChanged() {
    this.setPagination()
  }
  /**
   * Establece la paginación de los materiales en la parte inferior.
   */
  setPagination () {
    this.pagination = []
    if (this.page <= 3) {
      while (this.pagination.length < Math.min(this.totalPages, 5)) this.pagination.push(this.pagination.length + 1)
    } else {
      let i = Math.max(this.page - Math.min(2, this.totalPages - this.page), 1)
      while(this.totalPages - i < 4 && i >= 1) i--
      while (this.pagination.length < 5 && i <= this.totalPages) this.pagination.push(i++)
    }
  }


  /**
   * Muestra la primera página de materiales en una categoría
   */
  goToFirstPage () {
    this.goToPage(1)
  }

  /**
   * Muestra la última página de materiales en una categoría.
   */
  goToLastPage () {
    this.goToPage(this.totalPages)
  }

  /**
   * Muestra la página anterior a la actual de materiales en una categoría.
   */
  goToPrevPage () {
    if (this.page > 1) {
      this.goToPage(this.page - 1)
    }
  }

  /**
   * Muestra la página de materiales siguiente a la actual en una categoría.
   */
  goToNextPage () {
    if (this.page < this.totalPages) {
      this.goToPage(this.page + 1)
    }
  }

  /**
   * Muestra una página especifica de materiales en una categoría.
   * @param {any} page - Página a mostrar
   */
  goToPage (page) {
    if (page !== this.page) {
      this.page = page
    }
  }
}
