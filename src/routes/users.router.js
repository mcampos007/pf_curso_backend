import CustomRouter from './api/custom.router.js';
import { validateUser } from '../helpers/validateUser.js';
import {
  getAll,
  current,
  premiumUserChange,
  adminUser,
  login,
  register,
  logout,
  save,
  findById,
  updateDocument,
  uploadProfile,
  getAvatar,
  //sendLinkToPasswordReset,
} from '../controllers/users.controller.js';
import { uploadFiles, uploadDocuments } from '../helpers/multer.js';

import multer from 'multer';
const upload = multer({ dest: '/src/public/images' });
export default class UsersExtendRouter extends CustomRouter {
  init() {
    /*====================================================
                    EJEMPLO de como se conecta con el CustomRouter
                    --> this.verboHTTP(path, policies, ...callbacks);                   
        =====================================================*/

    this.get('/', ['ADMIN'], getAll);

    this.post('/register', ['PUBLIC'], validateUser, register);

    this.post('/login', ['PUBLIC'], login);

    //Logout
    this.get('/logout', ['USER', 'ADMIN', 'PREMIUM'], logout);

    this.get('/current', ['USER', 'PREMIUM', 'ADMIN'], current);

    this.post('/premium/:uid', ['USER', 'PREMIUM'], premiumUserChange);

    this.get('/adminUser', ['ADMIN'], adminUser);

    this.post(
      '/:uid/avatarprofile',
      ['USER', 'PREMIUM'],
      uploadFiles.array('profile'),
      uploadProfile
    );

    this.post(
      '/:uid/documents',
      ['USER', 'PREMIUM', 'ADMIN'],
      uploadDocuments.array('document'),
      async (req, res) => {
        console.log(1, req.files);
        console.log(111, req.body);
        const tipofile = req.body.tipofile;
        try {
          if (!req.files) {
            return res
              .status(400)
              .send({ status: 'error', mensaje: 'No se adjunto archivo.' });
          }

          const { uid } = req.params;
          let cantFiles = 0;
          // console.log(2, uid);
          const filesArray = req.files; // Suponiendo que req.files es tu array de archivos

          for (const file of filesArray) {
            try {
              const user = await findById(req, res);
              if (user) {
                const name = tipofile; //file.filename;
                const reference = `public/images/documents/${file.filename}`;

                const newDocument = {
                  name: tipofile,
                  reference: reference,
                };

                if (!user.documents) {
                  user.documents = [];
                }

                user.documents.push(newDocument);
                const status = `Se han subido ${cantFiles + 1} de Documentos`;

                const data = {
                  uid: uid,
                  newDocument: newDocument,
                  status: status,
                };
                const result = await updateDocument(data, res);
                console.log(result);

                cantFiles++;
              }
            } catch (error) {
              console.error('Error:', error);
              // Manejar el error como sea necesario
            }
          }
          // Actualizar el status del usuario indicando que se han subido x imagens de profile

          res.send({
            status: 'ok',
            message: 'Archivos subidos satisafactoriamente',
            filesUpload: cantFiles,
          });

          //
          //
          //   // Crear un nuevo documento con la información obtenida
          //
          //   // Agregar el nuevo documento al arreglo 'documents' del usuario
          //

          //   console.log(user);

          //   // Guardar los cambios en la base de datos utilizando el controlador de usuario
          //
          //   console.log('volvi');
          // console.log(result);
          //res.send({ status: 'OK' });
          //}
          //// quiero agregar informacion a la coleccionde usuarios
          // res
          //   .status(200)
          //   .send({ status: 'ok', mensaje: 'Avatar subido satisfactoriamente' });
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
    );

    this.get('/:uid/avatar', ['USER', 'PREMIUM', 'ADMIN'], getAvatar);

    // this.post(
    //   '/:uid/profile',
    //   ['USER', 'PREMIUM', 'ADMIN'],
    //   uploadFiles.array('profile'),
    //   async (req, res) => {
    //     console.log(1, req.files);
    //     try {
    //       if (!req.files) {
    //         return res
    //           .status(400)
    //           .send({ status: 'error', mensaje: 'No se adjunto archivo.' });
    //       }

    //       const { uid } = req.params;
    //       let cantFiles = 0;
    //       // console.log(2, uid);
    //       const filesArray = req.files; // Suponiendo que req.files es tu array de archivos

    //       for (const file of filesArray) {
    //         try {
    //           const user = await findById(req, res);
    //           if (user) {
    //             const name = file.fieldname;
    //             const reference = `public/images/profiles/${name}`;

    //             const newDocument = {
    //               name: name,
    //               reference: reference,
    //             };

    //             if (!user.documents) {
    //               user.documents = [];
    //             }

    //             user.documents.push(newDocument);
    //             const status = `Se han subido ${
    //               cantFiles + 1
    //             } de imágenes de perfil`;

    //             const data = {
    //               uid: uid,
    //               newDocument: newDocument,
    //               status: status,
    //             };
    //             const result = await updateDocument(data, res);
    //             console.log(result);

    //             cantFiles++;
    //           }
    //         } catch (error) {
    //           console.error('Error:', error);
    //           // Manejar el error como sea necesario
    //         }
    //       }
    //       // Actualizar el status del usuario indicando que se han subido x imagens de profile

    //       res.send({
    //         status: 'ok',
    //         message: 'Archivos subidos satisafactoriamente',
    //         filesUpload: cantFiles,
    //       });

    //       //
    //       //
    //       //   // Crear un nuevo documento con la información obtenida
    //       //
    //       //   // Agregar el nuevo documento al arreglo 'documents' del usuario
    //       //

    //       //   console.log(user);

    //       //   // Guardar los cambios en la base de datos utilizando el controlador de usuario
    //       //
    //       //   console.log('volvi');
    //       // console.log(result);
    //       //res.send({ status: 'OK' });
    //       //}
    //       //// quiero agregar informacion a la coleccionde usuarios
    //       // res
    //       //   .status(200)
    //       //   .send({ status: 'ok', mensaje: 'Avatar subido satisfactoriamente' });
    //     } catch (error) {
    //       console.log(error);
    //       res.send(error);
    //     }
    //   }
    // );
  }
}
