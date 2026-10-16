import prisma from "../database/prisma.js";

export class OutboxRepository {

  async create({
    aggregateType,
    aggregateId,
    eventType,
    payload,
  }) {
    return prisma.outboxEvent.create({
      data: {
        aggregate_type:
          aggregateType,

        aggregate_id:
          String(aggregateId),

        event_type:
          eventType,

        payload,

        status:
          "PENDING",
      },
    });
  }

  async findPending(
    limit = 10
  ) {
    return prisma.outboxEvent.findMany({
      where: {
        status: "PENDING",
      },

      orderBy: {
        created_at: "asc",
      },

      take: limit,
    });
  }

  async markPublished(id) {
    return prisma.outboxEvent.update({
      where: {
        id,
      },

      data: {
        status:
          "PUBLISHED",

        published_at:
          new Date(),
      },
    });
  }
}