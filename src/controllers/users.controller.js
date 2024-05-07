import { userService } from '../services/service.js';
import UsertDTO from '../services/dto/user.dto.js';
import {
  createHash,
  isValidPassword,
  generateJWToken,
} from '../helpers/utils.js';
import config from '../config/config.js';

//const productService = new ProductService();
export const getAll = async (req, res) => {
  try {
    const { limit, page, query, sort } = req.body;
    let users = await userService.getAll(limit, page, query, sort);
    res.send(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: 'No se pudo obtener los usuario.' });
  }
};

export const current = async (req, res) => {
  try {
    // console.log(req.params)
    // console.log(req.body)
    let result = await userService.findByUsername(req.user.email);
    let user = new UsertDTO(result);
    res.sendSuccess(user);
  } catch (error) {
    //    console.error(error);
    res
      .status(500)
      .send({ error: error, message: 'No se pudo obtener usuario actual.' });
    // res.sendSuccess(user);
  }
};

export const premiumUserChange = async (req, res) => {
  try {
    //res.sendSuccess(req.user)
    const { uid } = req.params;
    let user = await userService.findById(uid);
    user = new UsertDTO(user);
    // console.log(1, user);

    if (user.role === 'user' || user.role === 'premium') {
      let autorizarChange = true;
      if (user.role === 'premium') autorizarChange = true;
      if (user.role === 'user') {
        const requiredDocuments = [
          'Identificacion',
          'Comprobante de domicilio',
          'Comprobante de estado de cuenta',
        ]; // Documentos requeridos
        for (const documentName of requiredDocuments) {
          const documentExists = user.documents.some(
            (document) => document.name === documentName
          );
          // console.log(1, documentExists);
          // console.log(documentName);
          if (!documentExists) {
            autorizarChange = false;
            break; // No es necesario seguir buscando si falta uno de los documentos
          }
        }
      }
      // console.log(2, autorizarChange);
      if (autorizarChange) {
        const newRole =
          user.role === 'user'
            ? 'premium'
            : user.role === 'premium'
            ? 'user'
            : user.role;

        // Ahora puedes utilizar la variable newRole según sea necesario
        const filter = { _id: uid }; // Filtro para encontrar el documento a actualizar
        const value = { $set: { role: newRole } };
        //console.log(user)
        const result = await userService.update(filter, value);
        res.sendSuccess(result);
      } else {
        res.status(500).send({
          error: 'No esta autorizado a cambiar le perfil del usuario',
        });
      }
    }
  } catch (error) {
    // console.error(error);
    res.status(500).send({
      error: error,
      message: 'No se pudo actualizar el rol del usuario actual.',
    });
  }
};

export const adminUser = async (req, res) => {
  try {
    //res.sendSuccess(req.user)
    const id = '65d12fdfb5e365b718361a83';
    let user = await userService.adminUser(id);
    res.sendSuccess(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: 'No se pudo obtener usuario actual.' });
    res.sendSuccess(user);
  }
};

//user login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Validar si es admin
    const userAdmin = config.adminName;
    const passAdmin = config.adminPassword;

    let tokenUser = {};
    let userId = '';

    if (email === userAdmin && password === passAdmin) {
      //Es administrador
      tokenUser = {
        name: `${userAdmin}`,
        email: userAdmin,
        age: 57,
        role: 'admin',
      };
    } else {
      const user = await userService.findByUsername(email);
      if (!user) {
        //console.warn("User doesn't exists with username: " + email);
        return res.status(401).send({
          error: 'Not found',
          message: 'Invalid credentials! ' + email,
        });
      }

      if (!isValidPassword(user, password)) {
        //console.warn("Invalid credentials for user: " + email);
        return res
          .status(401)
          .send({ status: 'error', error: 'Invalid credentials!' });
      }
      // console.log(user)
      tokenUser = {
        name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        userId: user._id.toString(),
      };
      updatelastconnection(user._id.toString());
    }

    const access_token = generateJWToken(tokenUser);
    res.cookie('jwtCookieToken', access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true, //No se expone la cookie
      // httpOnly: false //Si se expone la cookie
    });

    res.send({
      message: 'Login successful!',
      access_token: access_token,
      id: userId,
    });
  } catch (error) {
    //console.error(error);
    return res
      .status(500)
      .send({ status: 'error', error: 'Error interno de la applicacion.' });
  }
};

export const register = async (req, res) => {
  try {
    let newUser = new UsertDTO(req.body);

    newUser.password = createHash(req.body.password);
    newUser.loggedBy = 'form';
    newUser.role = 'user';
    const userExist = await userService.findByUsername(newUser.email);
    if (userExist) {
      //el usuario ya existe
      res
        .status(400)
        .send({ message: 'El usuario ya existe en la base de datos.' });
    } else {
      const result = await userService.save(newUser);
      res.status(200).send({ status: 'success', payload: result });
    }
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .send({ error: error, message: 'Error al crear el usuario.' });
  }
};

export const save = async (req, res) => {
  const result = userService.save(req.user);
  return result;
};

export const findByTitle = async (req, res) => {
  try {
    let { title } = req.params;
    const result = await userService.findById(title);
    if (!result) {
      return res.json({
        error: 'El Usuario No Existe',
      });
    }
    res.json({
      result,
    });
  } catch (error) {
    return error;
  }
};

export const findById = async (req, res) => {
  try {
    let { uid } = req.params;
    const result = await userService.findById(uid);
    if (!result) {
      return res.json({
        error: 'El Usuario No Existe',
      });
    }
    return result;
  } catch (error) {
    return error;
  }
};

export const logout = async (req, res) => {
  if (req.user) {
    updatelastconnection(req.user.userId);
    res.clearCookie('jwtCookieToken');
    res.redirect('/');
  }
};
//
const updatelastconnection = async function (id) {
  const user = await userService.findById(id);
  // console.log(1, user);
  if (!user) {
    return res.send('Usuario no existe');
  }
  try {
    user.last_connection = new Date();
    const result = await userService.save(user);
    res.status(201).send(result);
  } catch (error) {
    return false;
  }
};

export const updateDocument = async (data, res) => {
  // console.log(7, data);
  try {
    const uid = data.uid;
    // console.log(71, uid);
    const user = await userService.findById(uid);
    // console.log(8, user);
    user.documents.push(data.newDocument);
    user.status = data.status;
    // console.log(9, user);
    let result = await userService.update({ _id: uid }, user);
    // console.log(10, result);
    return result;
  } catch (error) {
    res.status(500).send({
      error: 'No se pudo Actualizar el usuario.',
      message: error.message,
    });
  }
};

export const uploadProfile = async (req, res) => {
  // try {
  const { uid } = req.params;

  let cantFiles = 0;
  let payload = {};
  // console.log(2, uid);
  const filesArray = req.files; // Suponiendo que req.files es tu array de archivos

  for (const file of filesArray) {
    const user = await findById(req, res);
    if (user) {
      const reference = `images/profiles/${file.filename}`;

      const newDocument = {
        name: 'profile',
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
      const resultDocument = await updateDocument(data, res);
      //result = resultDocument;

      cantFiles++;
      // Actualizar el status del usuario indicando que se han subido x imagens de profile
      payload.document = newDocument;
    }
  }
  res.status(200).send({ status: 'ok', payload });
  //} catch (error) {
  // res.status(500).send({ status: 'No se subieron archivos', payload: error });
  //}
};

export const uploadDocument = async (req, res) => {
  // try {
  const { uid } = req.params;

  let cantFiles = 0;
  let payload = {};
  // console.log(2, uid);
  const filesArray = req.files; // Suponiendo que req.files es tu array de archivos

  for (const file of filesArray) {
    const user = await findById(req, res);
    if (user) {
      const reference = `images/documents/${file.filename}`;

      const newDocument = {
        name: 'document',
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
      const resultDocument = await updateDocument(data, res);
      //result = resultDocument;

      cantFiles++;
      // Actualizar el status del usuario indicando que se han subido x imagens de profile
      payload.document = newDocument;
    }
  }
  res.status(200).send({ status: 'ok', payload });
  //} catch (error) {
  // res.status(500).send({ status: 'No se subieron archivos', payload: error });
  //}
};
export const getAvatar = async (uid, res) => {
  try {
    // let { uid } = req.params;
    const userExist = await userService.findById(uid);
    if (!userExist) {
      return res.status(500).send({
        status: 'Error',
        payload: { message: 'El usuario no existe' },
      });
    }
    const avatar = await userService.getAvatar(uid);
    return avatar;
  } catch (error) {
    //console.log(error);
    res.status(500).send({ status: 'error', error });
    //return res.send('Error');
  }
};
