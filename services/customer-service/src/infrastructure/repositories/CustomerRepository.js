import prisma from "../database/prisma.js";

export class CustomerRepository {

  async findByUid(uid) {
    return prisma.customer.findUnique({
      where: {
        uid,
      },
      include: {
        membership: true,
      },
    });
  }

  async create({
    uid,
    fullname,
    mid,
  }) {
    return prisma.customer.create({
      data: {
        uid,
        fullname,
        mid,
      },
      include: {
        membership: true,
      },
    });
  }

  async update({
    uid,
    fullname,
  }) {
    return prisma.customer.update({
      where: {
        uid,
      },

      data: {
        fullname,
      },

      include: {
        membership: true,
      },
    });
  }

  async getDefaultMembership() {
    return prisma.membership.findUnique({
      where: {
        mname: "STANDARD",
      },
    });
  }
}