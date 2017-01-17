define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'UFPS Training Center';
      config.map([{ route: '', moduleId: './modules/login/login', title: 'Iniciar Sesión' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('modules/login/login',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Login = exports.Login = function Login() {
    _classCallCheck(this, Login);

    this.message = 'Test.';
  };
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <require from=\"./assets/css/styles.css\"></require>\n    <router-view></router-view>\n</template>\n"; });
define('text!modules/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <require from = \"./login.css\"></require>\n  <div class=\"col-md-4 col-md-offset-8 col-sm-7 col-sm-offset-5 ufps-container-sign\">\n    <div class=\"col-xs-12 text-center\">\n      <img class=\"ufps-logo-sign\" src=\"./src/assets/img/logo-transparent.png\" alt=\"\">\n    </div>\n    <div class=\"col-xs-10 col-xs-offset-1 text-center\">\n      <h1>Iniciar Sesión</h1>\n      <form action=\"\" class=\"text-left ufps-form-sign\">\n        <div class=\"form-group\">\n          <label for=\"email\">Correo Electrónico</label>\n          <input type=\"email\" class=\"form-control ufps-sign-input\" id=\"email\" placeholder=\"Email\">\n        </div>\n        <div class=\"form-group\">\n          <label for=\"password\">Contraseña</label>\n          <input type=\"password\" class=\"form-control ufps-sign-input\" id=\"password\" placeholder=\"Contraseña\">\n        </div>\n        <input type=\"submit\" class=\"btn ufps-btn-sign\" value=\"Iniciar Sesión\">\n      </form>\n      <div class=\"col-xs-4 text-left ufps-sign-links\">\n        <a href=\"#\">¡Regístrate!</a>\n      </div>\n      <div class=\"col-xs-8 text-right ufps-sign-links\">\n        <a href=\"#\">¿Olvidaste tu contraseña?</a>\n      </div>\n      <div class=\"col-sm-12 text-center ufps-sign-about hidden-xs\">\n        <p>\n          UFPS Training Center - 2016\n        </p>\n        <p>\n          Universidad Francisco de Paula Santander - Grupo de Estudio en Programación Competitiva\n        </p>\n      </div>\n    </div>\n  </div>\n</template>"; });
define('text!assets/css/styles.css', ['module'], function(module) { module.exports = "html,\nbody {\n  height: 100%;\n}\n\n.ufps-container-sign {\n  min-height: 100%;\n  background-color: #E74C3C;\n}\n\n.ufps-container-sign .ufps-logo-sign {\n  margin-top: 40px;\n  height: 120px;\n}\n\n.ufps-form-sign {\n  margin-top: 30px;\n}\n\n.ufps-container-sign h1 {\n  font-size: 24px;\n}\n\n.ufps-container-sign h1,\n.ufps-container-sign label {\n  color: #FFF;\n}\n\n.ufps-container-sign .ufps-sign-input, .ufps-navbar-input {\n  box-shadow: 0 0 10px #C0392B;\n  border: none;\n  height: 45px;\n  border-radius: 2px;\n  font-size: 16px;\n  transition: all .3s ease;\n}\n\n.ufps-navbar-input {\n  box-shadow: none;\n}\n.ufps-input-navbar-addon {\n  background-color: #FFF;\n  border: none;\n  cursor: pointer;\n}\n\n.ufps-navbar-input:focus {\n  box-shadow: none;\n}\n\n.ufps-container-sign .ufps-btn-sign {\n  width: 100%;\n  height: 45px;\n  border: 1px solid #ECF0F1;\n  color: #FFF;\n  font-size: 16px;\n  border-radius: 2px;\n  background-color: transparent;\n  margin-top: 20px;\n  transition: all .3s ease;\n}\n\n.ufps-container-sign .ufps-btn-sign:hover,\n.ufps-container-sign .ufps-btn-sign:active,\n.ufps-container-sign .ufps-btn-sign:hover:active,\n.ufps-container-sign .ufps-btn-sign:focus {\n  background-color: #FFF;\n  color: #C0392B;\n  box-shadow: 0 0 10px #C0392B;\n}\n\n.ufps-container-sign .ufps-btn-sign:focus {\n  outline: 0;\n  background-color: #FFF;\n  border: 1px solid #BDC3C7;\n}\n\n.ufps-sign-links {\n  margin-top: 20px;\n  margin-left: 0;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.ufps-sign-links a {\n  color: #FFF;\n  cursor: pointer;\n}\n\n.ufps-sign-about {\n  margin-top: 40px;\n}\n\n.ufps-sign-about p {\n  color: #FFF;\n  font-size: 14px;\n}\n\n.ufps-navbar {\n  background-color: #344958;\n  border-radius: 0;\n  border: none;\n  height: 65px;\n}\n\n.ufps-brand {\n  height: 65px;\n  padding: 5px 15px 5px 15px;\n}\n\n.ufps-brand img {\n  height: 55px;\n}\n\n.ufps-btn-nav a {\n  height: 65px;\n  padding-left: 18px!important;\n  padding-right: 18px!important;\n  line-height: 35px!important;\n  font-size: 16px;\n  color: #BDC3C7;\n  transition: all .3s ease;\n}\n\n.ufps-btn-nav.active a {\n  border-bottom: 6px solid #E74C3C;\n  color: #FFF;\n}\n\n.ufps-btn-nav a:hover {\n  background-color: transparent!important;\n  color: #FFF!important;\n}\n\n.ufps-btn-nav.dropdown.open > a{\n  background-color: transparent;\n  color: #FFF!important;\n}\n\n.ufps-dropdown-menu {\n  border: none;\n  border-radius: 0;\n}\n\n.ufps-dropdown-menu>li>a {\n  height: 40px;\n}\n\n.ufps-dropdown-menu>li>a:hover {\n  background-color: #E74C3C!important;\n}\n\n.ufps-navbar-search {\n  margin-top: 2px;\n}\n\n.ufps-avatar {\n  width: 55px;\n  height: 55px;\n  border-radius: 2px;\n}\n\n.ufps-dropdown-user a{\n  padding-top: 5px!important;\n  padding-bottom: 5px!important;\n}"; });
define('text!modules/login/login.css', ['module'], function(module) { module.exports = "html, body {\n      overflow: hidden;\n    }\n    @media (min-width: 768px) {\n      body {\n        background-image: url(src/assets/img/bg-pc.jpg);\n        background-position: center center;\n        background-repeat: no-repeat;\n        background-attachment: fixed;\n        background-size: cover;\n        background-color: #34495E;\n      }\n    }"; });
//# sourceMappingURL=app-bundle.js.map