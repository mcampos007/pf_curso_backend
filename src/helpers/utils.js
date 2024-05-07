import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { log } from 'console';
import config from '../config/config.js';
import passport from 'passport';
import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const categories = [
  'category_1',
  'category_2',
  'category_3',
  'category_4',
  'category_3',
];

// Generamos el hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validamos el hash
export const isValidPassword = (user, password) => {
  //console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
  return bcrypt.compareSync(password, user.password);
};

const PRIVATE_KEY = config.privatekey;

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '3600s' });
};

// authToken
export const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: 'User not authenticated or missing token.' });
  }

  const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra "Bearer asdfase56234234923".
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error: 'Token invalid, Unauthorized!' });
    }
    req.user = credentials.user;
    next();
  });
};

// para manejo de errores
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log('Entrando a llamar strategy: ');
    console.log(strategy);

    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

// para manejo de Auth
export const authorization = (role) => {
  return async (req, res, next) => {
    // console.log(role);
    if (!req.user)
      return res.status(401).send('Unauthorized: User not found in JWT');

    if (req.user.role !== role) {
      return res
        .status(403)
        .send('Forbidden: El usuario no tiene permisos con este rol.');
    }
    next();
  };
};

//Generacion de productos
export const generateProduct = (index) => {
  const randomCategory = faker.helpers.arrayElement(categories);

  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: `P-${String(index).padStart(8, '0')}`,
    price: faker.commerce.price(),
    status: true,
    category: randomCategory,
    stock: Number(faker.number.bigInt({ min: 10n, max: 100n })),
    // id: faker.database.mongodbObjectId(),
    thumbnail: Array.from({ length: 3 }, () => faker.image.url()),
  };
};

// // Configuracion MULTER
// const storage = multer.diskStorage({
//   // ubicaion del directorio donde voy a guardar los archivos
//   destination: function (req, file, cb) {
//     console.log(1, req.bpdy);
//     console.log(2, file);
//     let uploadFolder = 'public/images'; // Carpeta predeterminada
//     // Verificar el tipo de archivo y ajustar la carpeta de carga
//     if (req.body.profileImage) {
//       uploadFolder = 'public/profiles';
//     } else if (req.body.productImage) {
//       uploadFolder = 'public/products';
//     } else if (req.body.document) {
//       uploadFolder = 'public/documents';
//     }
//     console.log(3, uploadFolder);
//     cb(null, `${__dirname}/${uploadFolder}`);
//   },

//   // el nombre que quiero que tengan los archivos que voy a subir
//   filename: function (req, file, cb) {
//     // console.log(file);
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// export const uploader = multer({
//   storage,
//   // si se genera algun error, lo capturamos
//   onError: function (err, next) {
//     console.log(err);
//     next();
//   },
// });

export default __dirname;

/*
 
 
 
 
 
 
    thumbnail: { type: [String]
*/
