import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { Auth } from 'services/services'

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
        this.img_mutex = -3;

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
                this.routerService.navigate('transicion');


            } else if (this.its_this_planet(this.planet2)) {
                this.routerService.navigate('/problemas');
            }
        }, false);

        this.CANVAS.addEventListener("mousemove", (event) => {
            this.mouseX = event.pageX - this.CANVAS.offsetLeft + this.CANVAS.clientLeft;
            this.mouseY = event.pageY - this.CANVAS.offsetTop + this.CANVAS.clientTop;
        });


        this.background.onload = () => {

            this.img_mutex++;
            this.iterate();
        }

        this.planet1 = {
            name: "Training Center High School",
            w: 500,
            h: 500,
            x: 0,
            y: 0,
            bottom: 1,
            right: 1
        }
        this.planet1.x = 0.1091326908821349 * this.CANVAS.width - this.planet1.w / 2;
        this.planet1.y = 0.6528057553956835 * this.CANVAS.height - 5 * this.planet1.h / 8;

        this.planet1_IMG.onload = () => {
            this.img_mutex++;
            this.iterate();
        }

        this.planet2 = {
            name: "Training Center University",
            w: 500,
            h: 500,
            x: 0,
            y: 0,
            bottom: -1,
            right: -1
        }
        this.planet2.x = 0.8923498888065234 * this.CANVAS.width - this.planet2.w / 2;
        this.planet2.y = 0.1616546762589928 * this.CANVAS.height - 5 * this.planet2.h / 8;


        this.planet2_IMG.onload = () => {
            this.img_mutex++;
            this.iterate();

        }
        this.nave = {
            name: "Nave",
            w: 280,
            h: 180,
            x: 0,
            y: 0,
            bottom: -1,
            right: -1
        }
        this.nave.x = 0.9423498888065234 * this.CANVAS.width - this.nave.w / 2;
        this.nave.y = 0.5616546762589928 * this.CANVAS.height - 5 * this.nave.h / 8;


        this.nave.onload = () => {
            this.img_mutex++;
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
    }

    adjustCanvasResolution() {

        if (this.CANVAS.width !== this.CANVAS.clientWidth || this.CANVAS.height !== this.CANVAS.clientHeight) {
            this.CANVAS.width = this.CANVAS.clientWidth;
            this.CANVAS.height = this.CANVAS.clientHeight;
        }
    }

    iterate() {

        let grados = 180;
        if (this.img_mutex == 0) {
            
            setInterval(() => {
                if (this.CANVAS != null) {
                    if (grados >= 60) {
                        
                        this.turn(this.nave, grados);
                    }
                    this.adjustCanvasResolution();
                   /* this.turn(this.planet1, grados);
                    this.turn(this.planet2, grados + 180);*/
                    //this.turn(this.nave, grados);
                    this.draw();
                    //this.draw_sun();
                    this.check_highlights();

                    grados -=1;

                }
            }, 50);

        }
    }

    turn(planet, grados) {
        var rad = Math.PI / 180;
        var theta = 170;
        var rx = (-1.8) * this.CANVAS.width;
        var ry = 0;
        var a = grados;
        planet.x = this.CANVAS.width / 2 + rx * Math.cos(a * rad) * Math.cos(theta) - ry * Math.sin(a * rad) * Math.sin(theta) - planet.w / 8;
        planet.y = this.CANVAS.height / 2 + rx * Math.cos(a * rad) * Math.sin(theta) + ry * Math.sin(a * rad) * Math.cos(theta) - 5 * planet.h / 5;
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
        this.ctx.fillText(planet.name, (planet.x +70) + planet.w / 2, (planet.y - 20) + planet.h -520);

        this.CANVAS.style.cursor = "pointer";
    }
    addHighlight2(planet) {
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
        this.ctx.fillText(planet.name, (planet.x - 70) + planet.w / 2, (planet.y + 30) + planet.h + 25);

        this.CANVAS.style.cursor = "pointer";
    }

    its_this_planet(planet) {
        return (this.mouseY > planet.y && this.mouseY < planet.y + planet.h && this.mouseX > planet.x && this.mouseX < planet.x + planet.w)
    }

}