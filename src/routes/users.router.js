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
  uploadDocument,
  getAvatar,
  //sendLinkToPasswordReset,
} from '../controllers/users.controller.js';
import { uploadFiles, uploadDocuments } from '../helpers/multer.js';

// import multer from 'multer';
// const upload = multer({ dest: '/src/public/images' });
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
      ['USER'],
      uploadDocuments.array('documents'),
      uploadDocument
    );

    this.get('/:uid/avatar', ['USER', 'PREMIUM'], getAvatar);
  }
}
