import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { CONTROLS_FLOW_STATEMENTS_HELPURL } from '../../../../node_modules/blockly/msg/en';

/**
 * Principal(Module)
 * Módulo encargado de mostrar las opciones de aprendizajes y entrenamiento:
 * Training Center University y Training Center High School
 * @export
 * @class Principal
 */

// dependencias a inyectar: 
// servicio de Router (Router)
@inject(Router)
export class Principal {


    /**
     * Crea una instancia de Principal.
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(routerService) {

        this.CANVAS = HTMLCanvasElement;
        this.ctx = null;
        this.img_mutex = -3;

        this.mouseX = 0;
        this.mouseY = 0;
        this.routerService = routerService;

        this.PLANETA1 = null;
        this.PLANETA2 = null;
        this.FONDO = null;

    }
    attached() {
        this.cargar();
    }

    /*
    =====================================================================================================
    */
    cargar() {

            //this.CANVAS = document.getElementById('canvas');

            this.ctx = this.CANVAS.getContext("2d");

            this.adjustCanvasResolution();

            // Add event listener for `click` events.
            this.CANVAS.addEventListener('click', (event) => {
                
                if (this.esEstePlaneta(this.PLANETA1)) {
                    this.routerService.navigate('colegios');
                  
                    
                } else if (this.esEstePlaneta(this.PLANETA2)) {
                    this.routerService.navigate('../problemas/universidades');
                }
            }, false);

            this.CANVAS.addEventListener("mousemove", (event) => {
                this.mouseX = event.pageX - this.CANVAS.offsetLeft + this.CANVAS.clientLeft;
                this.mouseY = event.pageY - this.CANVAS.offsetTop + this.CANVAS.clientTop;
            });


            //  this.FONDO = new Image();
            //  this.FONDO.src = "../../../assets/img/universe2.png";



            this.FONDO.onload = () => {

                this.img_mutex++;
                this.iterar();
            }

            //0.3291326908821349   0.5928057553956835
            this.PLANETA1 = {
                nombre: "Training Center High School",
                w: 150,
                h: 150,
                x: 0,
                y: 0,
                abajo: 1,
                derecha: 1
            }
            this.PLANETA1.x = 0.3291326908821349 * this.CANVAS.width - this.PLANETA1.w / 2;
            this.PLANETA1.y = 0.5928057553956835 * this.CANVAS.height - 5 * this.PLANETA1.h / 8;
            //  this.PLANETA1_IMG = new Image();
            // this.PLANETA1_IMG.src = "../../../assets/img/planetTCHS.png";



            this.PLANETA1_IMG.onload = () => {
                this.img_mutex++;
                this.iterar();
            }

            //0.6723498888065234   0.4316546762589928
            this.PLANETA2 = {
                nombre: "Training Center University",
                w: 150,
                h: 150,
                x: 0,
                y: 0,
                abajo: -1,
                derecha: -1
            }
            this.PLANETA2.x = 0.6723498888065234 * this.CANVAS.width - this.PLANETA2.w / 2;
            this.PLANETA2.y = 0.4316546762589928 * this.CANVAS.height - 5 * this.PLANETA2.h / 8;
            // this.PLANETA2_IMG = new Image();
            //  this.PLANETA2_IMG.src = "../../../assets/img/planetTCU.png";


            this.PLANETA2_IMG.onload = () => {
                this.img_mutex++;
                this.iterar();

            }
        }
        /*
        =====================================================================================================
        */
    dibujar() {
        this.CANVAS.width = this.CANVAS.width; //Reinicia el canvas

        //imagen, posX, posY, width, height
        this.ctx.drawImage(this.FONDO, 0, 0, this.CANVAS.width, this.CANVAS.height);
        this.ctx.drawImage(this.PLANETA1_IMG, this.PLANETA1.x, this.PLANETA1.y, this.PLANETA1.w, this.PLANETA1.h);
        this.ctx.drawImage(this.PLANETA2_IMG, this.PLANETA2.x, this.PLANETA2.y, this.PLANETA2.w, this.PLANETA2.h);
    }

    adjustCanvasResolution() {
        // If it's resolution does not match change it

        if (this.CANVAS.width !== this.CANVAS.clientWidth || this.CANVAS.height !== this.CANVAS.clientHeight) {
            this.CANVAS.width = this.CANVAS.clientWidth;
            this.CANVAS.height = this.CANVAS.clientHeight;
        }
    }

    iterar() {

        //Si ya se cargaron las imágenes, hágale con confianza, al infinito y más allá
        let grados = 0;
        if (this.img_mutex == 0) {
            setInterval(() => {
                if (grados <= 360) {
                    grados += 360;
                }
                this.adjustCanvasResolution();
                this.girar(this.PLANETA1, grados);
                this.girar(this.PLANETA2, grados + 180);
                this.dibujar();
                this.dibujarSol();
                this.comprobarResaltados();

                grados -= 1;
            }, 50);

        }
    }



    girar(planeta, grados) {
        var rad = Math.PI / 180;
        var theta = 170 * rad;
        var rx = (0.4966641957005189 - 0.3291326908821349) * this.CANVAS.width;
        var ry = (0.5007194244604316 - 0.3107913669064748) * this.CANVAS.height;
        var a = grados;
        planeta.x = this.CANVAS.width / 2 + rx * Math.cos(a * rad) * Math.cos(theta) - ry * Math.sin(a * rad) * Math.sin(theta) - planeta.w / 2;
        planeta.y = this.CANVAS.height / 2 + rx * Math.cos(a * rad) * Math.sin(theta) + ry * Math.sin(a * rad) * Math.cos(theta) - 5 * planeta.h / 8;
    }

    comprobarResaltados() {
        if (this.esEstePlaneta(this.PLANETA1)) {
            this.agregarResaltado(this.PLANETA1);
        } else if (this.esEstePlaneta(this.PLANETA2)) {
            this.agregarResaltado(this.PLANETA2);
        } else {
            this.CANVAS.style.cursor = "initial";
        }
    }

    dibujarSol() {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(this.CANVAS.width / 2, this.CANVAS.height / 2, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "rgba(255, 255, 150, 0.8)";
        this.ctx.fill();
    }

    agregarResaltado(planeta) {
        this.ctx.beginPath();
        this.ctx.arc(planeta.x + planeta.w / 2, planeta.y + 5 * planeta.h / 8, 100, 0, 2 * Math.PI);
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = "rgba(255, 255, 0, .2)";
        this.ctx.stroke();

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#000";
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "rgb(241, 196, 15)";
        this.ctx.textAlign = "center";
        this.ctx.fillText(planeta.nombre, planeta.x + planeta.w / 2, planeta.y + planeta.h + 25);

        this.CANVAS.style.cursor = "pointer";
    }

    esEstePlaneta(planeta) {
        return (this.mouseY > planeta.y && this.mouseY < planeta.y + planeta.h && this.mouseX > planeta.x && this.mouseX < planeta.x + planeta.w)
    }
}