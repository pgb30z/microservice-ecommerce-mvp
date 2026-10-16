FROM node:20-bookworm-slim

WORKDIR /app/api-gateway

COPY api-gateway/package*.json ./

RUN npm ci

COPY api-gateway ./

COPY shared /app/shared

EXPOSE 3000

CMD ["npm", "start"]