import { ProductRepository } from "@api/repositories";
import { initialProducts } from "./initialProducts";

export async function initializeDataStore(
  productRepository: ProductRepository
): Promise<number> {
  try {
    const products = await productRepository.readProducts();
    const lastId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    if (products.length === 0) {
      await generateInitialProducts(productRepository);
    }
    return lastId;
  } catch (error) {
    console.error("Failed to initialize data store:", error);
    return 0;
  }
}

export async function generateInitialProducts(
  productRepository: ProductRepository
): Promise<void> {
  for (let product of initialProducts) {
    await productRepository.addProductWithoutId(product);
  }
}
