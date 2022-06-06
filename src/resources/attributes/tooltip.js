import { customAttribute, inject } from "aurelia-framework";
import $ from "bootstrap";

/**
 * Tooltip (Custom Attribute)
 * Permite utilizar la funcionalidad tooltip de bootstrap
 */


/**
 * Realiza la inyección de dependencias en la clase.
 * @return array con las dependencias: Element, el elemento al cual se aplicará el atributo.
 */
@customAttribute("bootstrap-tooltip")
@inject(Element)
export class TooltipCustomAttribute {

    /**
     * Crea una instancia de TooltipCustomAttribute
     * @param {Element} element - Elemento en el que se adaptará el atributo.
     */
    constructor(element) {
        this.element = element;
    }

    /**
     * Activa el tooltip una vez el elemento ha sido enlazado en la aplicación.
     */
    bind() {
        $(this.element).tooltip()
    }

    /**
     * Elimina el tooltip cuado el elemento ha sido desenlazado.
     */
    unbind() {
        $(this.element).tooltip('destroy')
    }
}