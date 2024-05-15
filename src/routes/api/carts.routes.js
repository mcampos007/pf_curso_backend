import CustomRouter from './custom.router.js';
import { validateCart, checkUserCart } from '../../helpers/validateCart.js';
import {
  getAll,
  getById,
  getByUserId,
  save,
  addProductToCart,
  deleteProductToCart,
  deleteCart,
  updateProductsInCart,
  purchaseCart,
  updateQuantityProduct,
} from '../../controllers/carts.controller.js';

export default class CartsRouter extends CustomRouter {
  init() {
    //Registra un carrito
    this.post('/', ['USER', 'PREMIUM'], validateCart, save);

    // Recuperar todos los productos del carrito
    this.get('/:cid', ['USER', 'PREMIUM', 'ADMIN'], getById);

    //Recuperar el carrito del usuario logueado
    this.get(
      '/currentCart/:uid',
      ['USER', 'PREMIUM'],
      getByUserId,
      (req, res) => {
        //console.log(req.params.uid);
      }
    );

    //Registrar un producto a uncarrito
    this.post(
      '/:cid/product/:pid',
      ['USER', 'PREMIUM'],
      validateCart,
      checkUserCart,
      addProductToCart
    );

    // Delete Cart
    this.delete('/:cid', ['USER', 'PREMIUM', 'ADMIN'], deleteCart);

    //Quitar un  producto a uncarrito
    this.delete(
      '/:cid/products/:pid',
      ['USER', 'PREMIUM', 'ADMIN'],
      validateCart,
      checkUserCart,
      deleteProductToCart
    );

    //Actualizar el carrito
    this.put('/:cid', ['USER', 'PREMIUM', 'ADMIN'], updateProductsInCart);

    //Actualizar la cantidad del producto en el carrito
    this.put(
      '/:cid/products/:pid',
      ['USER', 'PREMIUM', 'ADMIN'],
      updateQuantityProduct
    );

    this.post('/:cid/purchase', ['USER', 'PREMIUM'], purchaseCart);

    // //Registra un carrito
    // this.post('/', ['USER', 'PREMIUM'], validateCart, save);
  }
}
