import { Auth, Http } from "services/services"
import { AuthorizeStep } from "./authorize-step"
import 'bootstrap';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

require('jquery');

/**
 * App (Main Module)
 * Módulo central de la aplicación
 * @export
 * @class App
 */
export class App {
    /**
     * Método que realiza inyección de las dependencias necesarias en el módulo.
     * Estas dependencias son cargadas bajo el patrón de diseño singleton.
     * @static
     * @returns Array con las dependencias a inyectar: Servicio de autenticación (Auth),
     * Servicio de conexión http (Http)
     */
    static inject() {
        return [Auth, Http];
    }



    /**
     * Crea una instancia de App.
     * @param {service} authService - Servicio de Autenticación
     * @param {service} httpService - Servicio de conexión http
     */
    constructor(authService, httpService) {
        this.httpService = httpService;
        this.authService = authService;

        //window.jQuery = $;
        //window.$ = $;
    }

    configureRouter(config, router) {
        config.title = "UFPS Training Center";
        config.addPipelineStep("authorize", AuthorizeStep);
        config.options.pushState = true;
        config.options.root = "/";
        config.map([{
            route: "",
            redirect: "principal"
        },
        //Home
        {
            name: "home",
            route: "bienvenido",
            moduleId: PLATFORM.moduleName("./modules/home/home"),
            title: "Bienvenidos a Training Center",
            settings: {
                roles: ["visitor"]
            }
        },

        // Login
        /*{
            name: "login",
            route: "iniciar-sesion",
            moduleId: PLATFORM.moduleName("./modules/login/login"),
            title: "Iniciar Sesión",
            layoutView: PLATFORM.moduleName("layouts/not-logged.html"),
            settings: {
                roles: ["visitor"]
            }
        },*/
        // Signin
        /*{
            name: "signin",
            route: "registro",
            moduleId: PLATFORM.moduleName("./modules/signin/signin"),
            title: "Regístrate",
            layoutView: PLATFORM.moduleName("layouts/not-logged.html"),
            settings: {
                roles: ["visitor"]
            }
        },*/
        // Recovery Password
        {
            name: "recovery-password",
            route: "recuperar-password",
            moduleId: PLATFORM.moduleName("./modules/recovery/recovery-password"),
            title: "Recuperar Contraseña",
            layoutView: PLATFORM.moduleName("layouts/not-logged.html"),
            settings: {
                roles: ["visitor"]
            }
        },
        // Reset Password
        {
            name: "reset-password",
            route: "cambiar-password/:token",
            moduleId: PLATFORM.moduleName("./modules/recovery/reset-password"),
            title: "Recuperar Contraseña",
            layoutView: PLATFORM.moduleName("layouts/not-logged.html"),
            settings: {
                roles: ["visitor"]
            }
        },
        // Principal
        {
            name: "principal",
            route: "principal",
            moduleId: PLATFORM.moduleName("./modules/principal/principal"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        // Search
        {
            name: "search",
            route: "buscar/:query",
            moduleId: PLATFORM.moduleName("./modules/search/search"),
            title: "Búsqueda",
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            href: "/buscar/+",
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },

        // Problems
        {
            name: "problems",
            route: "problemas",
            moduleId: PLATFORM.moduleName("./modules/problems/problem"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        // Niveles
        {
            name: "levels",
            route: "niveles",
            moduleId: PLATFORM.moduleName("./modules/levels/niveles"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        // Ranking
        {
            name: "ranking",
            route: "ranking",
            moduleId: PLATFORM.moduleName("./modules/ranking/ranking"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Ranking",
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        {
            name: "submissions",
            route: "envios",
            moduleId: PLATFORM.moduleName("./modules/submissions/submissions"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Mis envios",
            nav: true,
            settings: {
                roles: ["coach", "student"]
            }
        },
        // maratones
        {
            name: "contest",
            route: "maraton",
            moduleId: PLATFORM.moduleName("./modules/contest/contest"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        // Clases
        {
            name: "classes",
            route: "clases",
            moduleId: PLATFORM.moduleName("./modules/syllabus/syllabus"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["coach", "student"]
            }
        },
        // Materiales
        {
            name: "material",
            route: ["materiales"],
            moduleId: PLATFORM.moduleName("./modules/material/material"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student", "visitor"]
            }
        },
        /*{
                name: "material",
                route: ["materials", "materials/:id"],
                moduleId: PLATFORM.moduleName("./modules/material/material"),
                layoutView: PLATFORM.moduleName("layouts/logged.html"),
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student", "visitor"]
                }
            },*/

            //Ayuda
        {
            name: "ayuda",
            route: ["ayuda"],
            moduleId: PLATFORM.moduleName("./modules/ayuda/ayuda"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        {
            name: "public-material",
            route: ["material-publico"],
            moduleId: PLATFORM.moduleName("./modules/material/public-material/public-material"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Material",
            nav: true,
            settings: {
                roles: ["visitor"]
            }
        },
        {
            route: "/material-publico/:id",
            name: "specific-material",
            moduleId: PLATFORM.moduleName("modules/material/specific-public-material/specific-public-material"),
            title: "Material",
            settings: {
                roles: ["visitor"]
            }
        },
        {
            name: "admin",
            route: ["administracion"],
            moduleId: PLATFORM.moduleName("./modules/admin/admin"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Administración",
            nav: true,
            settings: {
                roles: ["admin"]
            }
        },
        {
            name: "about",
            route: ["acerca-de"],
            moduleId: PLATFORM.moduleName("./modules/about/about"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Acerca de",
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        },
        {
            name: "profile",
            route: ["perfil"],
            moduleId: PLATFORM.moduleName("./modules/profile/profile"),
            layoutView: PLATFORM.moduleName("layouts/logged.html"),
            title: "Perfil",
            nav: true,
            settings: {
                roles: ["admin", "coach", "student"]
            }
        }
        ]);

        const handleUnknownRoutes = (instruction) => {
            return {
                route: "404",
                moduleId: PLATFORM.moduleName("./modules/error-404/error-404"),
                layoutView: PLATFORM.moduleName("layouts/logged.html"),
                title: "Error 404",
                settings: {
                    roles: ["admin", "coach", "student", "visitor"]
                }
            };
        };

        config.mapUnknownRoutes(handleUnknownRoutes);

        this.router = router;
    }


    attached() {
        let dsq = document.getElementById('disqus_thread');
        dsq.parentNode.removeChild(dsq);
      }


}