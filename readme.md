# Frontend - UFPS Training Center

## Configuraciones importantes

Antes de ejecutar, es necesario editar el archivo src/config/api.js y editar la url a la cual se conectará la aplicación para obtener datos de backend. Especificamente, debe modificarse el valor de 'apiUrl'.


## Instrucciones de instalación

Instalar las herramientas necesarias:

* npm install -g aurelia-cli
* npm install

### Para construir una versión con el código actual:

* au build // Versión de desarrollo con ayudas de depuración
* au build --env production // Versión de producción

### Para ejecutar la aplicación:

* au run
* au run --watch // construye una nueva versión y recarga el navegador cada vez que hay un cambio en el código

### Para ejecutar los tests unitarios:

* au test 
* au test --watch // No cierra el entorno de prueba, y se recarga en cada actualización del código