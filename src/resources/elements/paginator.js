import {bindable, bindingMode} from 'aurelia-framework'

export class Paginator {
  @bindable({defaultBindingMode: bindingMode.twoWay}) page
  @bindable({defaultBindingMode: bindingMode.twoWay}) totalPages

  constructor () {
    this.pagination = []
  }

  totalPagesChanged() {
    this.setPagination()
  }
  /**
   * Establece la paginación de los materiales en la parte inferior.
   */
  setPagination () {
    this.pagination = []
    if (this.page === this.totalPages && this.page - 4 > 0) {
      this.pagination.push(this.page - 4)
      this.pagination.push(this.page - 3)
    } else if (this.page + 1 === this.totalPages && this.page - 3 > 0) {
      this.pagination.push(this.page - 3)
    }
    if (this.page > 2) {
      this.pagination.push(this.page - 2)
    }
    if (this.page > 1) {
      this.pagination.push(this.page - 1)
    }
    this.pagination.push(this.page)
    while (this.pagination.length < 5 && this.pagination[this.pagination.length - 1] < this.totalPages) {
      this.pagination.push(this.pagination[this.pagination.length - 1] + 1)
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
