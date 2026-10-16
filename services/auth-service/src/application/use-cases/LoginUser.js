import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export class LoginUser {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute({ username, password }) {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        role: user.role.rolename,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    return {
      uid: user.uid,
      username: user.username,
      role: user.role.rolename,
      token,
    };
  }
}