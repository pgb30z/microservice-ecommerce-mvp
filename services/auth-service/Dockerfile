FROM node:20-bookworm-slim

WORKDIR /app/services/auth-service

COPY services/auth-service/package*.json ./

RUN npm ci

COPY services/auth-service ./

COPY shared /app/shared

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy" npx prisma generate --schema=prisma/schema.prisma

EXPOSE 4001 50051

CMD ["npm", "start"]