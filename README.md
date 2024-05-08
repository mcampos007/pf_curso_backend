### README - Español

# Proyecto Final del Curso de Backend - CoderHouse

Este proyecto es el trabajajo final del curso de Back End de CoderHouse, el mismo corresponde a un ecommerce que persiste la información en Mongodb, se utilizaron las siguientes librerias de terceros:

"@faker-js/faker": "^8.4.1",
"@handlebars/allow-prototype-access": "^1.0.5",
"axios": "^1.6.7",
"bcrypt": "^5.1.1",
"commander": "^12.0.0",
"connect-mongo": "^5.1.0",
"cookie-parser": "^1.4.6",
"cors": "^2.8.5",
"dotenv": "^16.4.1",
"express": "^4.18.2",
"express-compression": "^1.0.2",
"express-handlebars": "^7.1.2",
"express-session": "^1.17.3",
"jsonwebtoken": "^9.0.2",
"method-override": "^3.0.0",
"moment-timezone": "^0.5.45",
"mongoose": "^8.0.4",
"mongoose-paginate-v2": "^1.8.0",
"multer": "^1.4.5-lts.1",
"nodemailer": "^6.9.10",
"passport": "^0.7.0",
"passport-github2": "^0.1.12",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0",
"session-file-store": "^1.5.0",
"socket.io": "^4.7.4",
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.0",
"sweetalert2": "^11.10.3",
"twilio": "^4.23.0",
"uuid": "^9.0.1",
"winston": "^3.12.0"

## Características Principales

- **Servidor Express:** Se implementa el patrón singleton para la conexón a la base de datos y por medio de variables de entorno se puede decidir entre el entorno de producción : npm run prod o desarrollo npm run local. En el primer caso la información se persiste en mongo atlas y el el segundo en el local host. en cualquiera de los dos casos express esucha en el puerto 8080.

- **Registro de usuario:**. A traves del enpoint: http://{nombre del dominio}:8080/api/users/register . Mas información sobre el uso en /apidocs. Si el Registro se realiza por medio del front end se puede apreciar el funcionamiento de POST /api/email/registro

- **Logín de usuario:**. A traves del enpoint: http://{nombre del dominio}:8080/api/users/login. Mas información sobre el uso en /apidocs

- **Interfaz de usuario (front end):** La mayoría de las funcionalidades se pueden verificar por medio de http://{nombre del dominio}:8080

- **Subir documentos del usuario:** El endpoint /api/users/:uid/documents se utiliza para subir documentos ('Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta') que son necesario para poder cambiar de rol de usuario a usuario premium

- **Cambiar de usuario a usuario premium:** /api/users/premium permite cambiar de rol de usuario a premium y veceversa, para el primer caso es necesario que el la colección del usuario contenga los documentos indicados en el párrafo anterior

- **Recuperar todos los usuarios :** Se requiere nivel de admin, el end point es GET /api/users/

- **Productos:** en api/products se encuentran los end points para (Crear,listar y actualizar products)

- **:** La- **:** La

## Instalación y ejecución

1.  Clona este repositorio en tu máquina local.
2.  Instala las dependencias del proyecto utilizando npm:

```
npm install
```

1.  Inicia la aplicación:

```
npm run local o npm run prod

usuario adiminisrador : superMario, password: Bross

```

## Test con Postman

- **:** Postman- **:** Se adjunta un Json con pruebas para los distintos endpoint. el nombre del Json es PFEcommerce.postman_collection
