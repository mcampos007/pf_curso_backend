import express from 'express';

const router = express.Router();

function validateCart(req, res, next) {
  // console.log(1, 'Verificar si existe el carrito');
  // process.exit(1);
  const { quantity, products } = req.body;

  next();
}

function checkUserCart(req, res, next) {
  next();
}

export { validateCart, checkUserCart };
