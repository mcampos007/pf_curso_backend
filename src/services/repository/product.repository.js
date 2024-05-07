export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = (limit, page, query, sort) => {
    return this.dao.getAll(limit, page, query, sort);
  };
  findById = (id) => {
    return this.dao.findById(id);
  };
  findByTitle = async (title) => {
    return this.dao.findByTitle(title);
  };

  save = (product) => {
    return this.dao.save(product);
  };

  update = (id, product) => {
    return this.dao.update(id, product);
  };

  deleteProduct = async (id) => {
    return this.dao.deleteProduct(id);
  };
}
