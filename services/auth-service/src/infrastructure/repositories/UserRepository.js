import prisma from "../database/prisma.js";

export class UserRepository {
  async findByUsername(username) {
    return prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
  }

  async findById(uid) {
    return prisma.user.findUnique({
      where: {
        uid,
      },
      include: {
        role: true,
      },
    });
  }

  async create({ username, password, roleid }) {
    return prisma.user.create({
      data: {
        username,
        password,
        roleid,
      },
      include: {
        role: true,
      },
    });
  }
}