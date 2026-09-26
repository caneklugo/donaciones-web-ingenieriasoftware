// Modelo de usuario en memoria para donantes y administradores
class User {
  constructor(id, name, email, password, role = 'donor') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'donor' | 'admin'
    this.createdAt = new Date();
  }

  // Lista en memoria de usuarios registrados
  static users = [];

  static findByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static findById(id) {
    return this.users.find((u) => u.id === id);
  }

  static create({ name, email, password, role }) {
    const newUser = new User(
      (this.users.length + 1).toString(),
      name,
      email,
      password,
      role
    );
    this.users.push(newUser);
    return newUser;
  }

  static clear() {
    this.users = [];
  }
}

module.exports = User;
