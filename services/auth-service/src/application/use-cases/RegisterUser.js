import bcrypt from "bcrypt";
import prisma from "../../infrastructure/database/prisma.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export class RegisterUser {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute({ username, password }) {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const existingUser =
      await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const userRole = await prisma.role.findUnique({
      where: {
        rolename: "USER",
      },
    });

    if (!userRole) {
      throw new Error("USER role not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      roleid: userRole.roleid,
    });

    return {
      uid: user.uid,
      username: user.username,
      role: user.role.rolename,
    };
  }
}