import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

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
    

   
    CANVAS = null;
    ctx= null;
    img_mutex = -3;

    mouseX =0;
    mouseY =0;

    /**
     * Crea una instancia de Principal.
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(routerService) {
        this.canvasP = HTMLCanvasElement;
        this.routerService = routerService
        window.onload = function() {
            this.cargar();
        }
    
    }
    attached() {
        const context = this.canvasP.getContext('2d');
   
        // now you can do stuff with it
      }


   

    /*
    =====================================================================================================
    */
    cargar(){
            console.log("hi cris");
            this.CANVAS=document.getElementById('canvas');
            console.log(this.CANVAS);
            this.ctx=this.CANVAS.getContext("2d");
            console.log("hi cris");
            this.adjustCanvasResolution();

            // Add event listener for `click` events.
            this.CANVAS.addEventListener('click', function(event) {
                    if(esEstePlaneta(PLANETA1)){
                        alert("Saludos de parte del planeta "+PLANETA1.nombre);
                    }else if(esEstePlaneta(PLANETA2)){
                        alert("Saludos de parte del planeta "+PLANETA2.nombre);
                    }
            }, false);

            this.CANVAS.addEventListener("mousemove", function(event) {
                this.mouseX = event.pageX - this.CANVAS.offsetLeft + this.CANVAS.clientLeft;
                this.mouseY = event.pageY - this.CANVAS.offsetTop + this.CANVAS.clientTop;
            });
            
        
            this.FONDO = new Image();
            this.FONDO.src = "../../../assets/img/universe2.png";
            this.FONDO.onload = function () {
                this.img_mutex++;
                this.iterar();
            }

            //0.3291326908821349   0.5928057553956835
            PLANETA1 = {
                nombre : "Training Center High School",
                w : 150,
                h : 150,
                x : 0,
                y : 0,
                abajo : 1,
                derecha : 1
            }
            PLANETA1.x = 0.3291326908821349*this.CANVAS.width - PLANETA1.w/2;
            PLANETA1.y = 0.5928057553956835*this.CANVAS.height - 5*PLANETA1.h/8;
            PLANETA1_IMG = new Image();
            PLANETA1_IMG.src = "../../../assets/img/planetTCHS.png";
            PLANETA1_IMG.onload = function () {
                this.img_mutex++;
                this.iterar();
            }

            //0.6723498888065234   0.4316546762589928
            PLANETA2 = {
                nombre : "Training Center University",
                w : 150,
                h : 150,
                x : 0,
                y : 0,
                abajo : -1,
                derecha : -1
            }
            PLANETA2.x = 0.6723498888065234*this.CANVAS.width - PLANETA2.w/2;
            PLANETA2.y = 0.4316546762589928*this.CANVAS.height - 5*PLANETA2.h/8;
            PLANETA2_IMG = new Image();
            PLANETA2_IMG.src = "../../../assets/img/planetTCU.png";
            PLANETA2_IMG.onload = function () {
                this.img_mutex++;
                this.iterar();
                
            }
    }
    /*
    =====================================================================================================
    */
    dibujar(){
        console.log("dibuje");
        this.CANVAS.width=this.CANVAS.width; //Reinicia el canvas

        //imagen, posX, posY, width, height
        this.ctx.drawImage(this.FONDO, 0, 0, this.CANVAS.width, this.CANVAS.height);
        this.ctx.drawImage(PLANETA1_IMG, PLANETA1.x, PLANETA1.y, PLANETA1.w, PLANETA1.h);
        this.ctx.drawImage(PLANETA2_IMG, PLANETA2.x, PLANETA2.y, PLANETA2.w, PLANETA2.h);
    }

    iterar() {
        console.log("iterar");
        //Si ya se cargaron las imágenes, hágale con confianza, al infinito y más allá
        grados = 0;
        if(this.img_mutex == 0){
            setInterval(function(){
                if(grados <= 360){
                    grados += 360;
                }
                this.adjustCanvasResolution();
                this.girar(PLANETA1, grados);
                this.girar(PLANETA2, grados+180);
                this.dibujar();
                this.dibujarSol();
                this.comprobarResaltados();

                grados -= 1;
            },50);
            
        }
    }

    adjustCanvasResolution () {
    // If it's resolution does not match change it
    console.log("hi cris");
    if (this.CANVAS.width !== this.CANVAS.clientWidth || this.CANVAS.height !== this.CANVAS.clientHeight) {
        this.CANVAS.width = this.CANVAS.clientWidth;
        this.CANVAS.height = this.CANVAS.clientHeight;
    }
    }

    girar(planeta, grados) {
        var rad=Math.PI/180;
        var theta = 170*rad;
        var rx = (0.4966641957005189 - 0.3291326908821349) * this.CANVAS.width;
        var ry = (0.5007194244604316 - 0.3107913669064748) * this.CANVAS.height;
        var a = grados;
        planeta.x = this.CANVAS.width/2 + rx*Math.cos(a*rad)*Math.cos(theta) - ry*Math.sin(a*rad)*Math.sin(theta) - planeta.w/2;
        planeta.y = this.CANVAS.height/2 + rx*Math.cos(a*rad)*Math.sin(theta) +	ry*Math.sin(a*rad)*Math.cos(theta) - 5*planeta.h/8;
    }

    comprobarResaltados () {
        if(esEstePlaneta(PLANETA1)){
            this.agregarResaltado(PLANETA1);
        }else if(esEstePlaneta(PLANETA2)){
            this.agregarResaltado(PLANETA2);
        }else{
            this.CANVAS.style.cursor = "initial";
        }
    }

    dibujarSol () {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(this.CANVAS.width/2, this.CANVAS.height/2,15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "rgba(255, 255, 150, 0.8)";
        this.ctx.fill();
    }

    agregarResaltado (planeta) {
        this.ctx.beginPath();
        this.ctx.arc(planeta.x + planeta.w/2, planeta.y + 5*planeta.h/8, 100, 0, 2 * Math.PI);
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = "rgba(255, 255, 0, .2)";
        this.ctx.stroke();

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#000";
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "rgb(241, 196, 15)";
        this.ctx.textAlign = "center";
        this.ctx.fillText(planeta.nombre, planeta.x + planeta.w/2, planeta.y + planeta.h + 25);
        
        this.CANVAS.style.cursor = "pointer";
    }

    esEstePlaneta (planeta) {
        return (this.mouseY > planeta.y && this.mouseY < planeta.y + planeta.h && this.mouseX > planeta.x && this.mouseX < planeta.x + planeta.w)
    }
}