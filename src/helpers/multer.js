import multer from 'multer';
import __dirname from './utils.js';

// Configuracion MULTER
//Storage para profiles
const storage = multer.diskStorage({
  // ubicaion del directorio donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images/profiles`);
  },

  // el nombre que quiero que tengan los archivos que voy a subir
  filename: function (req, file, cb) {
    // console.log(file);
    let extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, `profile-${Date.now()}${extension}`);
  },
});

//Storage para documents
const storageDocuments = multer.diskStorage({
  // ubicaion del directorio donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images/documents`);
  },

  // el nombre que quiero que tengan los archivos que voy a subir
  filename: function (req, file, cb) {
    // console.log(file);
    let extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, `document-${Date.now()}${extension}`);
  },
});

export const uploadFiles = multer({
  storage: storage,
  // si se genera algun error, lo capturamos
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

export const uploadDocuments = multer({
  storage: storageDocuments,
  // si se genera algun error, lo capturamos
  onError: function (err, next) {
    console.log(err);
    next();
  },
});
