FROM node:20-bookworm-slim

WORKDIR /app/services/shipment-service

COPY services/shipment-service/package*.json ./

RUN npm ci

COPY services/shipment-service ./

COPY shared /app/shared

EXPOSE 4005 50055

CMD ["npm", "start"]