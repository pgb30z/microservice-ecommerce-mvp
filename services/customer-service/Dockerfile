FROM node:20-bookworm-slim

WORKDIR /app/services/customer-service

COPY services/customer-service/package*.json ./

RUN npm ci

COPY services/customer-service ./

COPY shared /app/shared

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy" npx prisma generate --schema=prisma/schema.prisma

EXPOSE 4002 50052

CMD ["npm", "start"]