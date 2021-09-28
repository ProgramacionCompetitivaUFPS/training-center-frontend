import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { Auth } from 'services/services'
import Tour from 'bootstrap-tour'

/**
 * CanvasPrincipal (Element)
 * Clase que genera una animación para el módulo PrincipalIndex
 * @export
 * @class CanvasPrincipal
 */
@inject(Auth, Router)
export class CanvasPrincipal {


    /**
     * Crea una instancia de CanvasPrincipal.
     * @param {service} authService - Servicio de autenticación
     * @param {service} routerService - Servicio de enrutamiento
     */

    constructor(authService, routerService) {
        this.authService = authService
        this.routerService = routerService

        this.CANVAS = HTMLCanvasElement;
        this.ctx = null;
        //this.img_mutex = -1;

        this.mouseX = 0;
        this.mouseY = 0;

        this.planet1 = null;
        this.planet2 = null;
        this.background = null;
        this.nave = null;
    }


    /**
     * Genera el canvas con la animación para el módulo Principal Index
     */

    attached() {
        this.load();
    }
    load() {
        this.ctx = this.CANVAS.getContext("2d");

        this.adjustCanvasResolution();

        // Add event listener for `click` events.
        this.CANVAS.addEventListener('click', (event) => {

            if (this.its_this_planet(this.planet1)) {
                this.routerService.navigate('colegios');


            } else if (this.its_this_planet(this.planet2)) {
                this.routerService.navigate('/problemas');
            }
        }, false);

        this.CANVAS.addEventListener("mousemove", (event) => {
            this.mouseX = event.pageX - this.CANVAS.offsetLeft + this.CANVAS.clientLeft;
            this.mouseY = event.pageY - this.CANVAS.offsetTop + this.CANVAS.clientTop;
        });


        this.background.onload = () => {

            //this.img_mutex++;
            //this.iterate();
        }

        this.planet1 = {
            name: "Training Center",
            w: 500,
            h: 500,
            x: 0,
            y: 0,
            bottom: 1,
            right: 1
        }
        this.planet1.x = 0.1091326908821349 * this.CANVAS.width - this.planet1.w / 2;
        this.planet1.y = 0.6528057553956835 * this.CANVAS.height - 2.8 * this.planet1.h / 8;

        this.planet1_IMG.onload = () => {
            //this.img_mutex++;
            //this.iterate();
        }

        this.planet2 = {
            name: "Training Center",
            w: 500,
            h: 500,
            x: 0,
            y: 0,
            bottom: -1,
            right: -1
        }
        this.planet2.x = 0.8923498888065234 * this.CANVAS.width - this.planet2.w / 2;
        this.planet2.y = 0.2916546762589928 * this.CANVAS.height - 5 * this.planet2.h / 8;


        this.planet2_IMG.onload = () => {
            //this.img_mutex++;
            //this.iterate();

        }
        this.nave = {
            name: " Nave",
            w: 280,
            h: 180,
            x: 0,
            y: 0,
            bottom: -1,
            right: -1
        }
        //this.nave.x = 0.9423498888065234 * this.CANVAS.width - this.nave.w / 2;
        //this.nave.y = 0.6016546762589928 * this.CANVAS.height - 4 * this.nave.h / 8;
        this.nave.x = 1.2423498888065234 * this.CANVAS.width - this.nave.w / 2;
        this.nave.y = 0.816546762589928 * this.CANVAS.height - 4 * this.nave.h / 8;


        this.Nave.onload = () => {
           // this.img_mutex++;
           this.iterate();

        }
    }

    draw() {
        this.CANVAS.width = this.CANVAS.width; //Reinicia el canvas

        //imagen, posX, posY, width, height
        this.ctx.drawImage(this.background, 0, 0, this.CANVAS.width, this.CANVAS.height);
        this.ctx.drawImage(this.planet1_IMG, this.planet1.x, this.planet1.y, this.planet1.w, this.planet1.h);
        this.ctx.drawImage(this.planet2_IMG, this.planet2.x, this.planet2.y, this.planet2.w, this.planet2.h);
        this.ctx.drawImage(this.Nave, this.nave.x, this.nave.y, this.nave.w, this.nave.h);

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#a91b0d";
        this.ctx.font = "bold 35px CroxoxoianText";
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.planet1.name, (this.planet1.x +25) + this.planet1.w / 2, (this.planet1.y - 20) + this.planet1.h -280);
        this.ctx.fillText("High School", (this.planet1.x +25) + this.planet1.w / 2, (this.planet1.y - 20) + this.planet1.h -240);
        

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#a91b0d";
        this.ctx.font = "bold 35px CroxoxoianText";
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.planet2.name, (this.planet2.x - 25) + this.planet2.w / 2, (this.planet2.y + 10) + this.planet2.h + -220);
        this.ctx.fillText("University", (this.planet2.x - 25) + this.planet2.w / 2, (this.planet2.y + 10) + this.planet2.h + -180);
    }

    adjustCanvasResolution() {

        if (this.CANVAS.width !== this.CANVAS.clientWidth || this.CANVAS.height !== this.CANVAS.clientHeight) {
            this.CANVAS.width = this.CANVAS.clientWidth;
            this.CANVAS.height = this.CANVAS.clientHeight;
        }
    }

    iterate() {
      
        this.draw();
        this.adjustCanvasResolution();
        this.check_highlights();
            setInterval(() => {
                
                let grados = 4;
                
                        setInterval(() => {
                            if (this.CANVAS != null) {
                                
                                this.adjustCanvasResolution();
                                if(grados >-80){
                                    this.turn(this.nave, grados);
                                    this.draw();
                                    this.check_highlights();
                                    grados -=1;
                                }
                                
                            }
                        }, 50);
                        this.nave.x = 1.2423498888065234 * this.CANVAS.width - this.nave.w / 2;
                        this.nave.y = 1.116546762589928 * this.CANVAS.height - 4 * this.nave.h / 8;
                        grados = 0;
                        this.turn(this.nave, grados);
            }, 4500);
        
        
        
    }

    turn(planet, grados) {
        planet.x += grados;
        planet.y += grados / 2.5;
        
    }

    check_highlights() {
        if (this.its_this_planet(this.planet1)) {
            this.addHighlight1(this.planet1);
        } else if (this.its_this_planet(this.planet2)) {
            this.addHighlight2(this.planet2);
        } else {
            this.CANVAS.style.cursor = "initial";
        }
    }

    /*draw_sun() {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(this.CANVAS.width / 2, this.CANVAS.height / 2, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "rgba(255, 255, 150, 0.8)";
        this.ctx.fill();
    }*/

    addHighlight1(planet) {
        this.ctx.beginPath();
        this.ctx.arc(planet.x + planet.w / 2, planet.y + 4 * planet.h / 8, 270, 0, 2 * Math.PI);
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = "rgba(255, 255, 0, .2)";
        this.ctx.stroke();

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#000";
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "rgb(241, 196, 15)";
        this.ctx.textAlign = "center";
        //this.ctx.fillText(planet.name, (planet.x +70) + planet.w / 2, (planet.y - 20) + planet.h -520);

    }
    addHighlight2(planet) {
        this.ctx.beginPath();
        this.ctx.arc(planet.x + planet.w / 2, planet.y + 4 * planet.h / 8, 270, 0, 2 * Math.PI);
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = "rgba(255, 255, 0, .2)";
        this.ctx.stroke(); // esto es el circulo

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "#000";
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "rgb(241, 196, 15)";
        this.ctx.textAlign = "center";
        //this.ctx.fillText(planet.name, (planet.x - 70) + planet.w / 2, (planet.y + 30) + planet.h + 25);

    }

    its_this_planet(planet) {
        return (this.mouseY > planet.y && this.mouseY < planet.y + planet.h && this.mouseX > planet.x && this.mouseX < planet.x + planet.w)
    }
    tour(){
        introJs().start();
    }

}