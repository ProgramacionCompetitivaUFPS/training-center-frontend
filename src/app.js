//import "bootstrap";
import { Auth, Http } from "services/services";
import { AuthorizeStep } from "./authorize-step";

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
        }
        /**
         * Se encarga del enrutamiento dentro de la aplicación
         * @param {any} config - Configuración de la aplicación
         * @param {any} router - Enrutador principal de la aplicación
         */
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
                moduleId: "./modules/home/home",
                title: "Bienvenidos a Training Center",
                settings: {
                    roles: ["visitor"]
                }
            },

            // Login
            {
                name: "login",
                route: "iniciar-sesion",
                moduleId: "./modules/login/login",
                title: "Iniciar Sesión",
                layoutView: "./layouts/not-logged.html",
                settings: {
                    roles: ["visitor"]
                }
            },
            // Signin
            {
                name: "signin",
                route: "registro",
                moduleId: "./modules/signin/signin",
                title: "Regístrate",
                layoutView: "./layouts/not-logged.html",
                settings: {
                    roles: ["visitor"]
                }
            },
            // Recovery Password
            {
                name: "recovery-password",
                route: "recuperar-password",
                moduleId: "./modules/recovery/recovery-password",
                title: "Recuperar Contraseña",
                layoutView: "./layouts/not-logged.html",
                settings: {
                    roles: ["visitor"]
                }
            },
            // Reset Password
            {
                name: "reset-password",
                route: "cambiar-password/:token",
                moduleId: "./modules/recovery/reset-password",
                title: "Recuperar Contraseña",
                layoutView: "./layouts/not-logged.html",
                settings: {
                    roles: ["visitor"]
                }
            },
            // Principal
            {
                name: "principal",
                route: "principal",
                moduleId: "./modules/principal/principal",
                layoutView: "./layouts/logged.html",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student"]
                }
            },
            // Search
            {
                name: "search",
                route: "buscar/:query",
                moduleId: "./modules/search/search",
                title: "Búsqueda",
                layoutView: "./layouts/logged.html",
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
                moduleId: "./modules/problems/problem",
                layoutView: "./layouts/logged.html",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student"]
                }
            },
            // Ranking
            {
                name: "ranking",
                route: "ranking",
                moduleId: "./modules/ranking/ranking",
                layoutView: "./layouts/logged.html",
                title: "Ranking",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student"]
                }
            },
            {
                name: "submissions",
                route: "envios",
                moduleId: "./modules/submissions/submissions",
                layoutView: "./layouts/logged.html",
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
                moduleId: "./modules/contest/contest",
                layoutView: "./layouts/logged.html",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student"]
                }
            },
            // Clases
            {
                name: "classes",
                route: "clases",
                moduleId: "./modules/syllabus/syllabus",
                layoutView: "./layouts/logged.html",
                nav: true,
                settings: {
                    roles: ["coach", "student"]
                }
            },
            {
                name: "material",
                route: ["materiales"],
                moduleId: "./modules/material/material",
                layoutView: "./layouts/logged.html",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student", "visitor"]
                }
            },
            /*{
                    name: "material",
                    route: ["materials", "materials/:id"],
                    moduleId: "./modules/material/material",
                    layoutView: "./layouts/logged.html",
                    nav: true,
                    settings: {
                        roles: ["admin", "coach", "student", "visitor"]
                    }
                },*/
            {
                name: "public-material",
                route: ["material-publico"],
                moduleId: "./modules/material/public-material/public-material",
                layoutView: "./layouts/logged.html",
                title: "Material",
                nav: true,
                settings: {
                    roles: ["visitor"]
                }
            },
            {
                route: "/material-publico/:id",
                name: "specific-material",
                moduleId: "modules/material/specific-public-material/specific-public-material",
                title: "Material",
                settings: {
                    roles: ["visitor"]
                }
            },
            {
                name: "admin",
                route: ["administracion"],
                moduleId: "./modules/admin/admin",
                layoutView: "./layouts/logged.html",
                title: "Administración",
                nav: true,
                settings: {
                    roles: ["admin"]
                }
            },
            {
                name: "about",
                route: ["acerca-de"],
                moduleId: "./modules/about/about",
                layoutView: "./layouts/logged.html",
                title: "Acerca de",
                nav: true,
                settings: {
                    roles: ["admin", "coach", "student"]
                }
            },
            {
                name: "profile",
                route: ["perfil"],
                moduleId: "./modules/profile/profile",
                layoutView: "./layouts/logged.html",
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
                moduleId: "./modules/error-404/error-404",
                layoutView: "./layouts/logged.html",
                title: "Error 404",
                settings: {
                    roles: ["admin", "coach", "student", "visitor"]
                }
            };
        };

        config.mapUnknownRoutes(handleUnknownRoutes);

        this.router = router;
    }
}