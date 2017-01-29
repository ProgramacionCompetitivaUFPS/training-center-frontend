define('app',['exports', 'aurelia-router', 'services/services'], function (exports, _aureliaRouter, _services) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    App.inject = function inject() {
      return [_services.Http];
    };

    function App(httpService) {
      _classCallCheck(this, App);

      this.httpService = httpService;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'UFPS Training Center';
      config.addPipelineStep('authorize', AuthorizeStep);
      config.map([{
        name: 'login',
        route: 'iniciar-sesion',
        moduleId: './modules/login/login',
        title: 'Iniciar Sesión',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      }, {
        name: 'signin',
        route: 'registro',
        moduleId: './modules/signin/signin',
        title: 'Regístrate',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      }, {
        name: 'recovery-password',
        route: 'recuperar-password',
        moduleId: './modules/recovery/recovery-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      }, {
        name: 'reset-password',
        route: 'cambiar-password/:token',
        moduleId: './modules/recovery/reset-password',
        title: 'Recuperar Contraseña',
        layoutView: './layouts/not-logged.html',
        settings: {
          roles: ['visitor']
        }
      }, {
        name: 'home',
        route: '',
        moduleId: './modules/home/home',
        settings: {
          roles: ['admin', 'coach', 'student']
        }
      }]);
      this.router = router;
    };

    return App;
  }();

  var AuthorizeStep = function () {
    AuthorizeStep.inject = function inject() {
      return [_services.Auth];
    };

    function AuthorizeStep(authService) {
      _classCallCheck(this, AuthorizeStep);

      this.authService = authService;
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.roles.indexOf('admin') !== -1;
      })) {
        if (this.authService.isAdmin()) {
          return next();
        }
      }
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.roles.indexOf('coach') !== -1;
      })) {
        if (this.authService.isCoach()) {
          return next();
        }
      }
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.roles.indexOf('student') !== -1;
      })) {
        if (this.authService.isStudent()) {
          return next();
        }
      }

      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.roles.indexOf('visitor') !== -1;
      })) {
        if (!this.authService.isVisitor()) {
          return next.cancel(new _aureliaRouter.Redirect(''));
        } else {
          return next();
        }
      }
      if (this.authService.isVisitor()) {
        return next.cancel(new _aureliaRouter.Redirect('iniciar-sesion'));
      } else {
        return next.cancel(new _aureliaRouter.Redirect(''));
      }
    };

    return AuthorizeStep;
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
define('main',['exports', './environment', 'fetch'], function (exports, _environment) {
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
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-notify', function (settings) {
      settings.timeout = 700000;
    });

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
define('config/api',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var API = exports.API = {
    apiUrl: 'http://demo9817161.mockable.io/',
    endponts: {
      auth: 'auth',
      users: 'users',
      recovery: 'recovery',
      reset: 'reset'
    },

    tokenName: 'Authorization'
  };
});
define('config/config',['exports', './api', './messages'], function (exports, _api, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_api).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _api[key];
      }
    });
  });
  Object.keys(_messages).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _messages[key];
      }
    });
  });
});
define('config/messages',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var MESSAGES = exports.MESSAGES = {
    loginWrongData: {
      text: 'Sus datos no coinciden. Inténtalo de nuevo',
      type: 'error'
    },
    loginIncompleteData: {
      text: 'Ingrese un usuario y contraseña para iniciar sesión',
      type: 'warning'
    },

    signInCorrect: {
      text: 'Su cuenta se ha creado exitosamente.',
      type: 'success'
    },
    signInWrongData: {
      text: 'Hay un error con sus datos. Verifícalos y vuelve a intentarlo',
      type: 'error'
    },
    signInIncompleteData: {
      text: 'Hay campos obligatorios sin llenar. Complétalos para registrar correctamente',
      type: 'warning'
    },
    signInDifferentPasswords: {
      text: 'Las contraseñas no coinciden',
      type: 'warning'
    },

    recoveryEmailSent: {
      text: 'Se ha enviado un mensaje a su correo para proceder a la recuperación de su contraseña',
      type: 'success'
    },
    recoveryMailDoesNotExist: {
      text: 'Este email no ha sido registrado en la plataforma',
      type: 'error'
    },
    recoveryInvalidToken: {
      text: 'Link invalido. Verifique el enlace enviado a su correo, e inténtelo de nuevo',
      type: 'error'
    },
    recoveryDifferentPasswords: {
      text: 'Las contraseñas no coinciden',
      type: 'warning'
    },
    recoveryCorrect: {
      text: 'Su contraseña se ha cambiado exitosamente',
      type: 'success'
    },

    serverError: {
      text: 'Ha ocurrido un error interno. Lo sentimos. Vuelve a intentarlo mas tarde',
      type: 'error'
    },
    unknownError: {
      text: 'Lo sentimos. Ha ocurrido un error',
      type: 'error'
    },
    permissionsError: {
      text: 'Usted no tiene permisos para realizar esta acción',
      type: 'error'
    }
  };
});
define('models/models',['exports', './user-login', './user-reset', './user-signin'], function (exports, _userLogin, _userReset, _userSignin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_userLogin).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _userLogin[key];
      }
    });
  });
  Object.keys(_userReset).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _userReset[key];
      }
    });
  });
  Object.keys(_userSignin).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _userSignin[key];
      }
    });
  });
});
define('models/user-login',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var UserLogIn = exports.UserLogIn = function UserLogIn() {
    var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var password = arguments[1];

    _classCallCheck(this, UserLogIn);

    this.email = email;
    this.password = password;
  };
});
define('models/user-reset',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var UserReset = exports.UserReset = function UserReset() {
    var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var confirmPassword = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var token = arguments[3];

    _classCallCheck(this, UserReset);

    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = token;
  };
});
define('models/user-signin',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var UserSignIn = exports.UserSignIn = function UserSignIn() {
    var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var confirmPassword = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var username = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var code = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var type = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

    _classCallCheck(this, UserSignIn);

    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.name = name;
    this.username = username;
    this.code = code;
    this.type = type;
  };
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator']);
  }
});
define('services/alert',['exports', 'aurelia-notify'], function (exports, _aureliaNotify) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Alert = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Alert = exports.Alert = function () {
    Alert.inject = function inject() {
      return [_aureliaNotify.NotificationService];
    };

    function Alert(notificationService) {
      _classCallCheck(this, Alert);

      this.notificationService = notificationService;
    }

    Alert.prototype.showMessage = function showMessage(message) {
      if (message.type === 'info') {
        this.notificationService.info(message.text);
      } else if (message.type === 'error') {
        this.notificationService.danger(message.text);
      } else if (message.type === 'success') {
        this.notificationService.success(message.text);
      } else if (message.type === 'warning') {
        this.notificationService.warning(message.text);
      }
    };

    return Alert;
  }();
});
define('services/auth',['exports', 'config/config', 'services/http', 'services/jwt'], function (exports, _config, _http, _jwt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Auth = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Auth = exports.Auth = function () {
    Auth.inject = function inject() {
      return [_http.Http, _jwt.Jwt];
    };

    function Auth(httpService, jwtService) {
      _classCallCheck(this, Auth);

      this.httpService = httpService;
      this.jwtService = jwtService;
    }

    Auth.prototype.auth = function auth(user) {
      return this.httpService.httpClient.fetch(_config.API.endponts.auth, {
        method: 'post',
        body: JSON.stringify(user)
      }).then(this.httpService.checkStatus).then(this.httpService.parseJSON);
    };

    Auth.prototype.registerStudent = function registerStudent(user) {
      return this.httpService.httpClient.fetch(_config.API.endponts.users, {
        method: 'post',
        body: JSON.stringify(user)
      }).then(this.httpService.checkStatus).then(this.httpService.parseJSON);
    };

    Auth.prototype.requestRecovery = function requestRecovery(email) {
      return this.httpService.httpClient.fetch(_config.API.endponts.recovery, {
        method: 'get',
        body: { email: email }
      }).then(this.httpService.checkStatus).then(this.httpService.parseJSON);
    };

    Auth.prototype.validateReset = function validateReset(token) {
      return this.httpService.httpClient.fetch(_config.API.endponts.reset, {
        method: 'post',
        body: { token: token }
      }).then(this.httpService.checkStatus).then(this.httpService.parseJSON);
    };

    Auth.prototype.resetPassword = function resetPassword(user) {
      return this.httpService.httpClient.fetch(_config.API.endponts.reset, {
        method: 'PATCH',
        body: JSON.stringify(user)
      }).then(this.httpService.checkStatus).then(this.httpService.parseJSON);
    };

    Auth.prototype.logout = function logout() {
      window.localStorage[_config.API.tokenName] = null;
      this.authorization = null;
    };

    Auth.prototype.isAuthenticated = function isAuthenticated() {
      return this.authorization !== null;
    };

    Auth.prototype.isStudent = function isStudent() {
      return this.jwtService.getUserType() === 'student';
    };

    Auth.prototype.isCoach = function isCoach() {
      return this.jwtService.getUserType() === 'coach';
    };

    Auth.prototype.isAdmin = function isAdmin() {
      return this.jwtService.getUserType() === 'admin';
    };

    Auth.prototype.isVisitor = function isVisitor() {
      return this.jwtService.getUserType() === 'visitor';
    };

    return Auth;
  }();
});
define('services/http',['exports', 'aurelia-fetch-client', 'config/api', 'fetch'], function (exports, _aureliaFetchClient, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Http = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Http = exports.Http = function () {
    function Http() {
      _classCallCheck(this, Http);

      this.httpClient = new _aureliaFetchClient.HttpClient();
      this.httpClient.configure(function (config) {
        config.useStandardConfiguration().withBaseUrl(_api.API.apiUrl);
      });
    }

    Http.prototype.checkStatus = function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    };

    Http.prototype.parseJSON = function parseJSON(response) {
      return response.json();
    };

    return Http;
  }();
});
define('services/jwt',['exports', 'config/config'], function (exports, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Jwt = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Jwt = exports.Jwt = function () {
    function Jwt() {
      _classCallCheck(this, Jwt);

      this.token = window.localStorage.getItem(_config.API.tokenName);
      if (this.tokenExists()) {
        this.data = JSON.parse(window.atob(this.token.split('.')[1]));
      } else {
        this.data = null;
      }
    }

    Jwt.prototype.save = function save(token) {
      window.localStorage.setItem(_config.API.tokenName, JSON.stringify(token));
      this.token = window.localStorage.getItem(_config.API.tokenName);
      this.data = JSON.parse(window.atob(this.token.split('.')[1]));
    };

    Jwt.prototype.remove = function remove() {
      window.localStorage.removeItem(_config.API.tokenName);
      this.token = null;
      this.data = null;
    };

    Jwt.prototype.tokenExists = function tokenExists() {
      return window.localStorage.getItem(_config.API.tokenName) !== null;
    };

    Jwt.prototype.getUsername = function getUsername() {
      if (!this.tokenExists) {
        return null;
      } else {
        return this.data.username;
      }
    };

    Jwt.prototype.getUserId = function getUserId() {
      if (!this.tokenExists) {
        return null;
      } else {
        return this.data.sub;
      }
    };

    Jwt.prototype.getUserType = function getUserType() {
      if (!this.tokenExists()) {
        return 'visitor';
      } else {
        var type = this.data.usertype;
        switch (type) {
          case '0':
            return 'student';
          case '1':
            return 'coach';
          case '2':
            return 'admin';
        }
        return 'visitor';
      }
    };

    return Jwt;
  }();
});
define('services/services',['exports', './alert', './auth', './http', './jwt'], function (exports, _alert, _auth, _http, _jwt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_alert).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _alert[key];
      }
    });
  });
  Object.keys(_auth).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _auth[key];
      }
    });
  });
  Object.keys(_http).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _http[key];
      }
    });
  });
  Object.keys(_jwt).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _jwt[key];
      }
    });
  });
});
define('modules/error-404/error-404',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Error404 = exports.Error404 = function Error404() {
    _classCallCheck(this, Error404);
  };
});
define('modules/home/home',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Home = exports.Home = function Home() {
    _classCallCheck(this, Home);
  };
});
define('modules/login/login',['exports', 'aurelia-router', 'config/config', 'models/models', 'services/services'], function (exports, _aureliaRouter, _config, _models, _services) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Login = exports.Login = function () {
    Login.inject = function inject() {
      return [_services.Auth, _services.Jwt, _aureliaRouter.Router, _services.Alert];
    };

    function Login(authorizationService, jwtService, router, alertService) {
      _classCallCheck(this, Login);

      this.authorizationService = authorizationService;
      this.jwtService = jwtService;
      this.router = router;
      this.alertService = alertService;
      this.user = new _models.UserLogIn();
    }

    Login.prototype.login = function login() {
      var _this = this;

      if (this.user.email !== '' && this.user.password !== '') {
        this.authorizationService.auth(this.user).then(function (data) {
          _this.jwtService.save(data.token);
          _this.router.navigate('');
        }).catch(function (error) {
          switch (error.status) {
            case 401:
              _this.alertService.showMessage(_config.MESSAGES.loginWrongData);
              _this.user = new _models.UserLogIn();
              break;
            case 500:
              _this.alertService.showMessage(_config.MESSAGES.serverError);
              break;
            default:
              _this.alertService.showMessage(_config.MESSAGES.unknownError);
          }
        });
      } else {
        this.alertService.showMessage(_config.MESSAGES.loginIncompleteData);
      }
    };

    return Login;
  }();
});
define('modules/recovery/recovery-password',['exports', 'config/config', 'services/services'], function (exports, _config, _services) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RecoveryPassword = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RecoveryPassword = exports.RecoveryPassword = function () {
    RecoveryPassword.inject = function inject() {
      return [_services.Alert, _services.Auth];
    };

    function RecoveryPassword(alertService, authService) {
      _classCallCheck(this, RecoveryPassword);

      this.alertService = alertService;
      this.authService = authService;
      this.email = '';
    }

    RecoveryPassword.prototype.requestRecovery = function requestRecovery() {
      var _this = this;

      if (this.email !== '') {
        this.authService.requestRecovery(this.email).then(function (data) {
          _this.alertService.showMessage(_config.MESSAGES.recoveryEmailSent);
        }).catch(function (error) {
          switch (error.status) {
            case 400:
              _this.alertService.showMessage(_config.MESSAGES.recoveryMailDoesNotExist);
              break;
            case 500:
              _this.alertService.showMessage(_config.MESSAGES.serverError);
              break;
            default:
              console.log(error);
              _this.alertService.showMessage(_config.MESSAGES.unknownError);
          }
        });
      }
    };

    return RecoveryPassword;
  }();
});
define('modules/recovery/reset-password',['exports', 'aurelia-router', 'config/config', 'models/models', 'services/services'], function (exports, _aureliaRouter, _config, _models, _services) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ResetPassword = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ResetPassword = exports.ResetPassword = function () {
    ResetPassword.inject = function inject() {
      return [_services.Alert, _services.Auth, _aureliaRouter.Router];
    };

    function ResetPassword(alertService, authorizationService, router) {
      _classCallCheck(this, ResetPassword);

      this.alertService = alertService;
      this.authorizationService = authorizationService;
      this.router = router;
      this.user = new _models.UserReset();
      this.tokenValid = false;
    }

    ResetPassword.prototype.activate = function activate(params, routeConfig) {
      var _this = this;

      this.routeConfig = routeConfig;
      this.user.token = params.token;
      this.authorizationService.validateReset(this.user.token).then(function (data) {
        _this.tokenValid = true;
        _this.user.email = data.email;
      }).catch(function (error) {
        switch (error.status) {
          case 400:
            _this.alertService.showMessage(_config.MESSAGES.recoveryInvalidToken);
            _this.router.navigate('iniciar-sesion');
            break;
          case 500:
            _this.alertService.showMessage(_config.MESSAGES.serverError);
            break;
          default:
            _this.alertService.showMessage(_config.MESSAGES.unknownError);
        }
      });
    };

    ResetPassword.prototype.requestResetPassword = function requestResetPassword() {
      var _this2 = this;

      if (this.user.password !== '' && this.user.confirmPassword === this.user.password) {
        this.authorizationService.resetPassword(this.user).then(function (data) {
          _this2.alertService.showMessage(_config.MESSAGES.recoveryCorrect);
          _this2.router.navigate('iniciar-sesion');
        }).catch(function (error) {
          switch (error.status) {
            case 400:
              _this2.alertService.showMessage(_config.MESSAGES.recoveryDifferentPasswords);
              _this2.user.password = '';
              _this2.user.confirmPassword = '';
              break;
            case 500:
              _this2.alertService.showMessage(_config.MESSAGES.serverError);
              break;
            default:
              _this2.alertService.showMessage(_config.MESSAGES.unknownError);
          }
        });
      } else {
        this.alertService.showMessage(_config.MESSAGES.recoveryDifferentPasswords);
        this.user.password = '';
        this.user.confirmPassword = '';
      }
    };

    return ResetPassword;
  }();
});
define('modules/signin/signin',['exports', 'aurelia-router', 'config/config', 'models/models', 'services/services'], function (exports, _aureliaRouter, _config, _models, _services) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Signin = exports.Signin = function () {
    Signin.inject = function inject() {
      return [_services.Alert, _services.Auth, _aureliaRouter.Router];
    };

    function Signin(alertService, authorizationService, router) {
      _classCallCheck(this, Signin);

      this.alertService = alertService;
      this.authorizationService = authorizationService;
      this.router = router;
      this.user = new _models.UserSignIn();
      this.user.type = 0;
    }

    Signin.prototype.signin = function signin() {
      var _this = this;

      if (this.user.email != null && this.user.password != null && this.user.confirmPassword != null && this.user.name != null && this.user.username != null && this.user.type != null) {
        if (this.user.password === this.user.confirmPassword) {
          this.authorizationService.registerStudent(this.user).then(function (data) {
            _this.alertService.showMessage(_config.MESSAGES.signInCorrect);
            _this.router.navigate('iniciar-sesion');
          }).catch(function (error) {
            switch (error.status) {
              case 400:
                _this.alertService.showMessage(_config.MESSAGES.signInWrongData);
                break;
              case 401:
                _this.alertService.showMessage(_config.MESSAGES.permissionsError);
                break;
              case 500:
                _this.alertService.showMessage(_config.MESSAGES.serverError);
                break;
              default:
                _this.alertService.showMessage(_config.MESSAGES.unknownError);
            }
          });
        } else {
          this.alertService.showMessage(_config.MESSAGES.signInDifferentPasswords);
          this.user.password = '';
          this.user.confirmPassword = '';
        }
      } else {
        this.alertService.showMessage(_config.MESSAGES.signInIncompleteData);
      }
    };

    return Signin;
  }();
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _class.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return _class;
  }());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <require from=\"./assets/css/styles.css\"></require>\n    <loading-indicator loading.bind=\"router.isNavigating || httpService.httpClient.isRequesting\"></loading-indicator>\n\n    <router-view></router-view>\n</template>\n"; });
define('text!layouts/not-logged.css', ['module'], function(module) { module.exports = "html,\nbody {\n  overflow: hidden;\n}\n\n@media (min-width: 768px) {\n  body {\n    background-image: url(src/assets/img/bg-pc.jpg);\n    background-position: center center;\n    background-repeat: no-repeat;\n    background-attachment: fixed;\n    background-size: cover;\n    background-color: #34495E;\n  }\n}\n"; });
define('text!layouts/not-logged.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./not-logged.css\"></require>\n  <div class=\"col-md-4 col-md-offset-8 col-sm-7 col-sm-offset-5 ufps-container-sign\">\n    <slot name=\"content\"></slot>\n    <div class=\"col-sm-12 text-center ufps-sign-about hidden-xs\">\n      <p>\n        UFPS Training Center - 2016\n      </p>\n      <p>\n        Universidad Francisco de Paula Santander\n      </p>\n    </div>\n  </div>\n</template>\n"; });
define('text!assets/css/styles.css', ['module'], function(module) { module.exports = "html,\nbody {\n  height: 100%;\n}\n\n.ufps-container-sign {\n  min-height: 100%;\n  background-color: #E74C3C;\n}\n\n.ufps-container-sign .ufps-logo-sign {\n  margin-top: 40px;\n  height: 120px;\n}\n\n.ufps-container-sign .ufps-logo-sign-in {\n  margin-top: 20px;\n  height: 80px;\n}\n\n.ufps-form-sign {\n  margin-top: 30px;\n}\n\n.ufps-container-sign h1 {\n  font-size: 24px;\n}\n\n.ufps-container-sign h1,\n.ufps-container-sign label,\n.ufps-container-sign p {\n  color: #FFF;\n}\n\n.ufps-container-sign .ufps-sign-input,\n.ufps-navbar-input {\n  box-shadow: 0 0 10px #C0392B;\n  border: none;\n  height: 45px;\n  border-radius: 2px;\n  font-size: 16px;\n  transition: all .3s ease;\n}\n\n.ufps-navbar-input {\n  box-shadow: none;\n}\n\n.ufps-input-navbar-addon {\n  background-color: #FFF;\n  border: none;\n  cursor: pointer;\n}\n\n.ufps-navbar-input:focus {\n  box-shadow: none;\n}\n\n.ufps-container-sign .ufps-btn-sign {\n  width: 100%;\n  height: 45px;\n  border: 1px solid #ECF0F1;\n  color: #FFF;\n  font-size: 16px;\n  border-radius: 2px;\n  background-color: transparent;\n  margin-top: 20px;\n  transition: all .3s ease;\n}\n\n.ufps-container-sign .ufps-btn-sign:hover,\n.ufps-container-sign .ufps-btn-sign:active,\n.ufps-container-sign .ufps-btn-sign:hover:active,\n.ufps-container-sign .ufps-btn-sign:focus {\n  background-color: #FFF;\n  color: #C0392B;\n  box-shadow: 0 0 10px #C0392B;\n}\n\n.ufps-container-sign .ufps-btn-sign:focus {\n  outline: 0;\n  background-color: #FFF;\n  border: 1px solid #BDC3C7;\n}\n\n.ufps-sign-links {\n  margin-top: 20px;\n  margin-left: 0;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.ufps-sign-links,\n.ufps-sign-links a {\n  color: #FFF;\n  cursor: pointer;\n}\n\n.ufps-sign-about {\n  margin-top: 40px;\n}\n\n.ufps-sign-about p {\n  color: #FFF;\n  font-size: 14px;\n}\n\n.ufps-navbar {\n  background-color: #344958;\n  border-radius: 0;\n  border: none;\n  height: 65px;\n}\n\n.ufps-brand {\n  height: 65px;\n  padding: 5px 15px 5px 15px;\n}\n\n.ufps-brand img {\n  height: 55px;\n}\n\n.ufps-btn-nav a {\n  height: 65px;\n  padding-left: 18px!important;\n  padding-right: 18px!important;\n  line-height: 35px!important;\n  font-size: 16px;\n  color: #BDC3C7;\n  transition: all .3s ease;\n}\n\n.ufps-btn-nav.active a {\n  border-bottom: 6px solid #E74C3C;\n  color: #FFF;\n}\n\n.ufps-btn-nav a:hover {\n  background-color: transparent!important;\n  color: #FFF!important;\n}\n\n.ufps-btn-nav.dropdown.open>a {\n  background-color: transparent;\n  color: #FFF!important;\n}\n\n.ufps-dropdown-menu {\n  border: none;\n  border-radius: 0;\n}\n\n.ufps-dropdown-menu>li>a {\n  height: 40px;\n}\n\n.ufps-dropdown-menu>li>a:hover {\n  background-color: #E74C3C!important;\n}\n\n.ufps-navbar-search {\n  margin-top: 2px;\n}\n\n.ufps-avatar {\n  width: 55px;\n  height: 55px;\n  border-radius: 2px;\n}\n\n.ufps-dropdown-user a {\n  padding-top: 5px!important;\n  padding-bottom: 5px!important;\n}\n\n\n/*INLINE FORM*/\n\n\n/* form starting stylings ------------------------------- */\n\n.ufps-form-inline {\n  position: relative;\n  margin-bottom: 20px;\n}\n\n.ufps-form-inline input {\n  font-size: 14px;\n  padding: 5px 10px 7px 5px;\n  background: transparent;\n  display: block;\n  width: 100%;\n  border: none;\n  color: #FFF;\n  border-bottom: 1px solid #FFF;\n}\n\n.ufps-form-inline input:focus {\n  outline: none;\n}\n\n\n/* LABEL ======================================= */\n\n.ufps-form-inline label {\n  color: #FFF;\n  font-size: 14px;\n  font-weight: normal;\n  position: absolute;\n  pointer-events: none;\n  left: 5px;\n  top: 10px;\n  transition: 0.2s ease all;\n  -moz-transition: 0.2s ease all;\n  -webkit-transition: 0.2s ease all;\n}\n\n\n/* active state */\n\n.ufps-form-inline input:focus~label,\n.ufps-form-inline input:valid~label {\n  top: -14px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #FFF;\n}\n\n\n/* BOTTOM BARS ================================= */\n\n.ufps-form-inline .ufps-form-bar {\n  position: relative;\n  display: block;\n  width: 100%;\n}\n\n.ufps-form-inline .ufps-form-bar:before,\n.ufps-form-inline .ufps-form-bar:after {\n  content: '';\n  height: 2px;\n  width: 0;\n  bottom: 1px;\n  position: absolute;\n  background: #FFF;\n  transition: 0.2s ease all;\n  -moz-transition: 0.2s ease all;\n  -webkit-transition: 0.2s ease all;\n}\n\n.ufps-form-inline .ufps-form-bar:before {\n  left: 50%;\n}\n\n.ufps-form-inline .ufps-form-bar:after {\n  right: 50%;\n}\n\n\n/* active state */\n\n.ufps-form-inline input:focus~.ufps-form-bar:before,\n.ufps-form-inline input:focus~.ufps-form-bar:after {\n  width: 50%;\n}\n\n#nprogress .bar {\n  background: #c0392b!important;\n  box-shadow: 0 0 10px rgba(192, 57, 43, .5);\n  height: 4px!important;\n}\n\n#nprogress .peg {\n  box-shadow: 0 0 10px #c0392b, 0 0 5px #c0392b!important;\n}\n\n#nprogress .spinner-icon {\n  border-top-color: #c0392b!important;\n  border-left-color: #c0392b!important;\n}\n\n.alert {\n  position: absolute;\n  z-index: 100;\n  font-family: Helvetica Neue, Helvetica, san-serif;\n  font-size: 16px;\n  top: 0;\n  left: 30%;\n  width: 40%;\n  color: #444;\n  padding: 10px;\n  opacity:.7;\n  text-align: center;\n  background-color: #fff;\n  border: none;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n  transition: all .4s ease;\n}\n.alert:hover {\n  opacity: 1;\n}\n\n\n.alert-success {\n  background-color: #18bc9c;\n  color: #FFF;\n}\n\n.alert-danger {\n  background-color: #e74c3c;\n  color: #FFF;\n}\n\n.alert-info {\n  background-color: #3498db;\n  color: #FFF;\n}\n\n.alert-warning {\n  background-color: #ff9800;\n  color: #FFF;\n}\n"; });
define('text!modules/error-404/error-404.html', ['module'], function(module) { module.exports = "<template>\n  error 404\n</template>"; });
define('text!modules/recovery/reset-password.css', ['module'], function(module) { module.exports = "@media (min-width: 768px) {\n  body {\n    background-image: url(../../../src/assets/img/bg-pc.jpg)!important;\n  }\n}"; });
define('text!modules/home/home.html', ['module'], function(module) { module.exports = "<template>\n  Home\n</template>"; });
define('text!modules/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <div slot=\"content\">\n    <div class=\"col-xs-12 text-center\">\n      <img class=\"ufps-logo-sign\" src=\"./src/assets/img/logo-transparent.png\" alt=\"\">\n    </div>\n    <div class=\"col-xs-10 col-xs-offset-1 text-center\">\n      <h1>Iniciar Sesión</h1>\n      <form action=\"\" class=\"text-left ufps-form-sign\" submit.delegate = \"login()\">\n        <div class=\"form-group\">\n          <label for=\"email\">Correo Electrónico</label>\n          <input type=\"email\" class=\"form-control ufps-sign-input\" id=\"email\" placeholder=\"Email\" value.bind=\"user.email\" required>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"password\">Contraseña</label>\n          <input type=\"password\" class=\"form-control ufps-sign-input\" id=\"password\" placeholder=\"Contraseña\" value.bind=\"user.password\" required>\n        </div>\n        <input type=\"submit\" class=\"btn ufps-btn-sign\" value=\"Iniciar Sesión\">\n      </form>\n      <div class=\"col-xs-4 text-left ufps-sign-links\">\n        <a route-href=\"route: signin\">¡Regístrate!</a>\n      </div>\n      <div class=\"col-xs-8 text-right ufps-sign-links\">\n        <a route-href=\"route: recovery-password\">¿Olvidaste tu contraseña?</a>\n      </div>\n    </div>\n  </div>\n</template>"; });
define('text!modules/recovery/recovery-password.html', ['module'], function(module) { module.exports = "<template>\n  <div slot=\"content\">\n    <div class=\"col-xs-12 text-center\">\n      <img class=\"ufps-logo-sign\" src=\"./src/assets/img/logo-transparent.png\" alt=\"\">\n    </div>\n    <div class=\"col-xs-10 col-xs-offset-1 text-center\">\n      <h1>Nueva contraseña</h1>\n      <form submit.delegate = \"requestRecovery()\" class=\"text-left ufps-form-sign\">\n        <div class=\"form-group\">\n          <label for=\"email\">Correo Electrónico</label>\n          <input type=\"email\" class=\"form-control ufps-sign-input\" id=\"email\" placeholder=\"Email\" value.bind=\"email\" required>\n        </div>\n        <input type=\"submit\" class=\"btn ufps-btn-sign\" value=\"Recuperar contraseña\">\n      </form>\n      <div class=\"col-xs-4 text-left ufps-sign-links\">\n        <a route-href=\"route: signin\">Regístrate</a>\n      </div>\n      <div class=\"col-xs-8 text-right ufps-sign-links\">\n        <a route-href=\"route: login\">Inicia Sesión</a>\n      </div>\n      \n    </div>\n  </div>\n</template>"; });
define('text!modules/recovery/reset-password.html', ['module'], function(module) { module.exports = "<template>\n  <div slot=\"content\">\n    <div class=\"col-xs-12 text-center\">\n      <img class=\"ufps-logo-sign\" src=\"../src/assets/img/logo-transparent.png\" alt=\"\">\n    </div>\n    <div class=\"col-xs-10 col-xs-offset-1 text-center\">\n      <h1>Nueva contraseña</h1>\n      <form submit.delegate=\"requestResetPassword()\" class=\"text-left ufps-form-sign\">\n        <div class=\"form-group\">\n          <label for=\"email\">Correo Electrónico</label>\n          <input type=\"email\" class=\"form-control ufps-sign-input\" id=\"email\" placeholder=\"Email\" value.bind = \"user.email\" required disabled>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"password\">Nueva Contraseña</label>\n          <input type=\"password\" class=\"form-control ufps-sign-input\" id=\"password\" placeholder=\"Contraseña\" value.bind = \"user.password\" required disabled.bind = \"!tokenValid\">\n        </div>\n        <div class=\"form-group\">\n          <label for=\"password\">Repite la contraseña</label>\n          <input type=\"password\" class=\"form-control ufps-sign-input\" id=\"password2\" placeholder=\"Repite la contraseña\" value.bind = \"user.confirmPassword\" required disabled.bind = \"!tokenValid\">\n        </div>\n        <input type=\"submit\" class=\"btn ufps-btn-sign\" value=\"Cambiar contraseña\">\n      </form>\n      \n    </div>\n  </div>\n</template>"; });
define('text!modules/signin/signin.html', ['module'], function(module) { module.exports = "<template>\n  <div slot=\"content\">\n    <div class=\"col-xs-12 text-center\">\n      <img class=\"ufps-logo-sign-in\" src=\"./src/assets/img/logo-transparent.png\" alt=\"\">\n    </div>\n    <div class=\"col-xs-10 col-xs-offset-1 text-center\">\n      <h1>Regístrate</h1>\n      <form submit.delegate = \"signin()\" class=\"text-left ufps-form-sign\">\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"text\" class=\"ufps-form-text\" id=\"name\" value.bind=\"user.name\" required>\n          <label for=\"name\">Nombre</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"text\" class=\"ufps-form-text\" id=\"nickname\"  value.bind=\"user.username\" required>\n          <label for=\"nickname\">Username</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"number\" class=\"ufps-form-text\" id=\"code\"  value.bind=\"user.code\" required>\n          <label for=\"code\">Código</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"email\" class=\"ufps-form-text\" id=\"email\"  value.bind=\"user.email\" required>\n          <label for=\"email\">Correo Electrónico</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"password\" class=\"ufps-form-text\" id=\"password\"  value.bind=\"user.password\" required>\n          <label for=\"password\">Contraseña</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <div class=\"form-group ufps-form-inline\">\n          <input type=\"password\" class=\"ufps-form-text\" id=\"password2\"  value.bind=\"user.confirmPassword\" required>\n          <label for=\"password2\">Repite la contraseña</label>\n          <span class=\"ufps-form-bar\"></span>\n        </div>\n        <input type=\"submit\" class=\"btn ufps-btn-sign\" value=\"Regístrate\">\n      </form>\n\n      <div class=\"col-xs-12 text-center ufps-sign-links\">\n        <a route-href=\"route: login\">¿Ya tienes una cuenta? ¡Inicia Sesión!</a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map