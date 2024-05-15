export default class PasswordResetRespository {
  constructor(dao) {
    this.dao = dao;
  }

  findByEmail = (email) => {
    return this.dao.findByEmail(email);
  };

  save(user) {
    return this.dao.save(user);
  }

  findByToken(token) {
    return this.dao.findByToken(token);
  }
}
