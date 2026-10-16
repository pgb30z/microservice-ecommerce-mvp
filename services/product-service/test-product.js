import { connectMongoDB } from "./src/infrastructure/database/mongodb.js";
import { CreateProduct } from "./src/application/use-cases/CreateProduct.js";
import { GetProducts } from "./src/application/use-cases/GetProducts.js";

async function main() {
  await connectMongoDB();

  const createProduct =
    new CreateProduct();

  const getProducts =
    new GetProducts();

  try {
    const product =
      await createProduct.execute({
        pid: 1,
        pname: "Laptop",
        price: 15000000,
        quantity: 10,
      });

    console.log(
      "Product created successfully!"
    );

    console.log(product);
  } catch (error) {
    console.log(
      "Create:",
      error.message
    );
  }

  const products =
    await getProducts.execute();

  console.log("Products:");
  console.log(products);

  process.exit(0);
}

main();