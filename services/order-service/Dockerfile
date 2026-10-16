FROM node:20-bookworm-slim

WORKDIR /app/services/order-service

COPY services/order-service/package*.json ./

RUN npm ci

COPY services/order-service ./

COPY shared /app/shared

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy" npx prisma generate --schema=prisma/schema.prisma

EXPOSE 4004 50054

CMD ["npm", "start"]