export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  findById = (id) => {
    return this.dao.findById(id);
  };
  save = (product) => {
    return this.dao.save(product);
  };

  addProductToCart = async (cart, pid) => {
    return this.dao.addProductToCart(cart, pid);
  };

  deleteProductToCart = async (cart, pid) => {
    return this.dao.deleteProductToCart(cart, pid);
  };
  delete = async (cid) => {
    return this.dao.deleteCart(cid);
  };

  findByUser = (id) => {
    return this.dao.findByUser(id);
  };

  update = (id, cart) => {
    return this.dao.update(id, cart);
  };
  getAll = () => {
    return this.dao.getAll();
  };
  /*update = (id, product) => {
        return this.dao.update(id, product);
    }
    findByUsername = async (username) => {
        return this.dao.findByUsername(username);
    }; */
}
