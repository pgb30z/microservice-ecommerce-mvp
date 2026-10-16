import "dotenv/config";

import redisClient from "../config/redisClient.js";


async function checkHttpService(
  name,
  url
) {
  try {
    const response =
      await fetch(
        `${url}/health`,
        {
          signal:
            AbortSignal.timeout(
              3000
            ),
        }
      );

    if (!response.ok) {
      return {
        name,
        status: "DOWN",
      };
    }

    return {
      name,
      status: "UP",
    };

  } catch (error) {
    return {
      name,
      status: "DOWN",
    };
  }
}


async function checkRedis() {
  try {
    const result =
      await redisClient.ping();

    return result === "PONG"
      ? "UP"
      : "DOWN";

  } catch (error) {
    return "DOWN";
  }
}


export async function checkSystemHealth() {

  const [
    redis,
    auth,
    customer,
    product,
    order,
    shipment,
  ] =
    await Promise.all([
      checkRedis(),

      checkHttpService(
        "auth-service",
        process.env.AUTH_HTTP_URL
      ),

      checkHttpService(
        "customer-service",
        process.env.CUSTOMER_HTTP_URL
      ),

      checkHttpService(
        "product-service",
        process.env.PRODUCT_HTTP_URL
      ),

      checkHttpService(
        "order-service",
        process.env.ORDER_HTTP_URL
      ),

      checkHttpService(
        "shipment-service",
        process.env.SHIPMENT_HTTP_URL
      ),
    ]);

  const dependencies = {
    redis,

    "auth-service":
      auth.status,

    "customer-service":
      customer.status,

    "product-service":
      product.status,

    "order-service":
      order.status,

    "shipment-service":
      shipment.status,
  };


  const allUp =
    Object.values(
      dependencies
    ).every(
      (status) =>
        status === "UP"
    );


  return {
    service:
      "api-gateway",

    status:
      allUp
        ? "UP"
        : "DEGRADED",

    dependencies,

    timestamp:
      new Date()
        .toISOString(),
  };
}