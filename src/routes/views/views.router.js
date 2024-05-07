import CustomRouter from '../api/custom.router.js';
import config from '../../config/config.js';
import axios from 'axios';
import errorHandler from '../../services/errors/middlewares/index.js';
import { getAvatar } from '../../controllers/users.controller.js';

export default class ViewsRouter extends CustomRouter {
  init() {
    //                Rutas Comunes
    // Index
    this.get('/', ['PUBLIC'], (req, res) => {
      const data = {
        title: 'Torolf - Ecommerce',
        bodyClass: 'landing-page style', // Puedes cambiar esto dinámicamente según tus necesidades
      };
      if (!req.user) {
        data.username = '';
      } else {
        data.username = req.user.name;
      }
      res.render('index', data);
    });

    //Login
    this.get('/login', ['PUBLIC'], (req, res) => {
      const data = {
        title: 'signup-page',
        bodyClass: 'signup-page ', // Puedes cambiar esto dinámicamente según tus necesidades
      };

      res.render('users/login', data);
    });

    //Logout
    this.get('/logout', ['USER', 'ADMIN', 'PREMIUM'], (req, res) => {
      res.clearCookie('jwtCookieToken');
      // Enviar una respuesta al cliente

      res.status(200).send('Sesión cerrada correctamente');

      res.redirect('/');
      // req.session.destroy((err) => {
      //   if (!err) {
      //     // res.send('Logoutok!');
      //     res.redirect('/');
      //   } else {
      //     res.send({ ststus: 'Logout error', body: err });
      //   }
      // });
    });

    //Home
    this.get('/home', ['USER', 'PREMIUM', 'ADMIN'], (req, res) => {
      // console.log(req.user.role)
      let isAdmin = false;
      let isPremium = false;
      let isUser = false;
      if (req.user.role === 'admin') isAdmin = true;
      if (req.user.role === 'premium') isPremium = true;
      if (req.user.role === 'user') isUser = true;
      const data = {
        // title: 'Signup-page',
        title: 'Home - Page',
        bodyClass: 'landing-page style', // Puedes cambiar esto dinámicamente según tus necesidades
        username: req.user.name,
        role: req.user.role,
        isAdmin,
        isPremium,
        isUser,
      };
      res.render('home', data);
    });

    // Ver Perfil
    this.get('/profile', ['USER', 'ADMIN', 'PREMIUM'], async (req, res) => {
      const data = req.user;
      let isAdmin = false;
      let isPremium = false;
      let isUser = false;
      if (req.user.role === 'admin') isAdmin = true;
      if (req.user.role === 'premium') isPremium = true;
      if (req.user.role === 'user') isUser = true;
      data.bodyClass = 'signup-page';
      data.username = req.user.name;
      // apiUrl = `http://localhost:${config.port}/api/users/${req.user.userId}/avatar`;
      const avatar = await getAvatar(req.user.userId, res);
      console.log(1, avatar);
      //data.role: req.user.role,
      data.isAdmin = isAdmin;
      data.isPremium = isPremium;
      data.isUser = isUser;
      data.avatar = avatar;
      //Recuerara avatar si tiene

      res.render('users/profile', data);
      // try {
      //   const reqData = {
      //     method: req.method,
      //     url: req.url,
      //     headers: req.headers,
      //     data: req.body
      // };
      //   const apiUrl = `http://localhost:${config.port}/api/extend/users/current`;
      //   const result = await axios.get(apiUrl, reqData);
      //   res.send(result)
      // } catch (error) {
      //   console.log(error);
      //   //res.status(500).json({ error: 'Hubo un error al Recuperar Products.' });
      //   return res.render('errors', {
      //     message: 'Hubo un error al Recuperar el perfil del usuario.',
      //   });
    });

    // chage role

    // Link to password Reset
    this.get('/linkpasswordreset', ['PUBLIC'], (req, res) => {
      const data = {
        title: 'Link to Password-reset',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
      };
      console.log(data);
      res.render('users/requestpasswordresetlink', data);
    });

    // Reasignación de Password
    this.get('/passwordreset/:token', ['PUBLIC'], (req, res) => {
      const { token } = req.params;
      const data = {
        title: 'Password-reset',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
        token: token,
      };
      res.render('users/passwordreset', data);
    });

    //  Regiter
    this.get('/register', ['PUBLIC'], (req, res) => {
      const data = {
        title: 'Register-page',
        bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
      };
      res.render('users/register', data);
    });

    //                                Rutas Admin
    // Products
    this.get('/admin/products', ['ADMIN'], async (req, res) => {
      try {
        const { limit, page, query, sort } = req.query;
        const apiUrl = `http://localhost:${config.port}/api/products`;
        const response = await axios.get(apiUrl, {
          params: {
            limit: limit,
            page: page,
            query: query,
            sort: sort,
          },
        });
        let isAdmin = false;
        let isPremium = false;
        let isUser = false;
        if (req.user.role === 'admin') isAdmin = true;
        if (req.user.role === 'premium') isPremium = true;
        if (req.user.role === 'user') isUser = true;
        const products = response.data;
        const data = {
          title: 'profile-page',
          bodyClass: 'profile-page',
        };
        res.render('products/index', {
          title: 'Product List',
          products,
          bodyClass: 'profile-page',
          username: req.user.name,
          role: req.user.role,
          isAdmin,
          isPremium,
          isUser,
        });
      } catch (error) {
        console.log(error);
        //res.status(500).json({ error: 'Hubo un error al Recuperar Products.' });
        return res.render('errors', {
          message: 'Hubo un error al Recuperar Products.',
        });
      }
    });

    //Rutas                           User
    //Products
    this.get('/products', ['USER'], async (req, res) => {
      try {
        console.log(req.user);
        const { limit, page, query, sort } = req.query;
        const apiUrl = `http://localhost:${config.port}/api/products`;
        const response = await axios.get(apiUrl, {
          params: {
            limit: limit,
            page: page,
            query: query,
            sort: sort,
          },
        });
        let isAdmin = false;
        let isPremium = false;
        let isUser = false;
        if (req.user.role === 'admin') isAdmin = true;
        if (req.user.role === 'premium') isPremium = true;
        if (req.user.role === 'user') isUser = true;
        const products = response.data;
        const data = {
          title: 'profile-page',
          bodyClass: 'profile-page',
        };
        res.render('products/index', {
          title: 'Product List',
          products,
          bodyClass: 'profile-page',
          username: req.user.name,
          role: req.user.role,
          isAdmin,
          isPremium,
          isUser,
        });
      } catch (error) {
        console.log(error);
        //res.status(500).json({ error: 'Hubo un error al Recuperar Products.' });
        return res.render('errors', {
          message: 'Hubo un error al Recuperar Products.',
        });
      }
    });

    //Add to Cart
    this.post('/addToCart', ['USER'], async (req, res) => {
      try {
        // console.log(req.user)
        // console.log(req.body)
        const data = {
          products: [
            {
              product: req.product_id, // Reemplaza con un ID de producto existente
              quantity: 1,
            },
          ],
          user: req.user.userId,
        };
        const token = req.token;
        console.log(token);
        const result = await axios.post(
          `http://localhost:${config.port}/api/carts`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!result) {
          console.log(error);
          throw new Error('Error al regitrar Cart');
        } // console.log(result)
        res.send('enviado');
      } catch (error) {
        // Manejo del error
        console.error(error);
      }
    });

    this.router.use(errorHandler);
  }
}

/*

//Home
//passport.authenticate('jwt', {session: false})
router.get(
  '/profile',
  passportCall('current'),
  authorization('user'),
  (req, res) => {
    const data = {
      title: 'Signup-page',
      bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
      user: req.user,
    };
    res.render('users/profile', data);
  }
);

router.get('/current', passportCall('current'), (req, res) => {
  console.log('***');
  console.log(req);
  const data = {
    title: 'Signup-page',
    bodyClass: 'signup-page', // Puedes cambiar esto dinámicamente según tus necesidades
    user: req.user,
  };
  res.render('users/profile', data);
});

//Logout
router.get('/logout', (req, res) => {
  
});



//Ejmplo de llamado a la ruta get para productos con jwt
router.get(
  '/products',
  passport.authenticate('current', { session: false }),
  async (req, res) => {
    
);

router.get('/linkpasswordreset', (req, res) =>{
  const data = {
    title: 'Link to Password-reset',
    bodyClass: 'signup-page' // Puedes cambiar esto dinámicamente según tus necesidades
    
  };
  res.render('users/requestpasswordresetlink', data);
})



function auth(req, res, next) {
  if (req.session.user === 'adminCoder@coder.com' && req.session.admin) {
    return next;
  } else {
    return res.status(403).send('No estas autorizado a ver este recurso');
  }
}

router.post('/setcookie', (req, res) => {
  console.log(req.body);
  res
    .cookie('username', req.body.email, { maxAge: 100000, signed: true })
    .send('');
});

router.get('/getcookie', (req, res) => {
  // Sin firma
  // res.send(req.cookies)

  // Con firma
  console.log(req.signedCookies);
  res.send(req.signedCookies);
});

router.get('/session', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado ${req.session.counter} veces el sitio`);
  } else {
    req.session.counter = 1;
    res.send('Bienvenido');
  }
});

router.get('/chat', passportCall('current'), (req, res) => {
  const data = req.user;
  const rotulos = {
    title: 'Nuestro canal de comunicación en línea......',
  };
  console.log('data');
  console.log(data);
  res.render('chats/index', {
    rotulos,
    title: rotulos.title,
    bodyClass: 'signup-page',
    data,
  });
});

router.get('/testlogs', (req, res) => {
  //{ error: 0, warn: 1, info: 2, htt:3, verbose: 4, debug: 5, silly: 6 }
  // fatal: 0,  error: 1,  warning: 2,  info: 3,  debug: 4,
  const msgfatal = 'Registro de fatal';
  const msgerror = 'Registro de Error';
  const msgwarning = 'Registro de warning';
  const msginfo = 'Registro de Info';
  const msgdebug = 'Registro de debug';
  
  
  req.logger.fatal(`Error a Registrar: ----> ${msgfatal} `);
  req.logger.error(`Error a Registrar: ----> ${msgerror} `);
  req.logger.warning(`Error a Registrar: ----> ${msgwarning} `);
  req.logger.info(`Error a Registrar: ----> ${msginfo} `);
  req.logger.debug(`Error a Registrar: ----> ${msgdebug} `);
  
  const msgEnviados = {
    fatal: msgfatal,
    error: msgerror,
    warning: msgwarning,
    info: msginfo,
    debug: msgdebug
  }
  res.send(msgEnviados);
});


// Vistas p/Admin
//  products
router.get('/admin/products', ['ADMIN'], (req, res) =>{
  console.log("Entro por admin")
})

export default router;
*/
