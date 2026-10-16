FROM node:20-bookworm-slim

WORKDIR /app/services/product-service

COPY services/product-service/package*.json ./

RUN npm ci

COPY services/product-service ./

COPY shared /app/shared

EXPOSE 4003 50053

CMD ["npm", "start"]