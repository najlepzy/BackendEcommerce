import path from "path";
import { Product } from "@api/models";
import { ProductRepository } from "@api/repositories";
import { initializeDataStore } from "@api/data";

export class ProductManager {
  private productRepository: ProductRepository;
  private lastId: number = 0;

  constructor() {
    const filePath = path.join(__dirname, "../../data/products.json");
    this.productRepository = new ProductRepository(filePath);
    this.initialize();
  }

  private async initialize() {
    this.lastId = await initializeDataStore(this.productRepository);
  }

  public async readProducts(): Promise<Product[]> {
    return this.productRepository.readProducts();
  }

  public async getProductById(pid: number): Promise<Product | undefined> {
    return this.productRepository.findProductById(pid);
  }

  public async addProduct(product: Omit<Product, "id">): Promise<void> {
    const newProduct: Product = { ...product, id: ++this.lastId, status: true };
    await this.productRepository.addProduct(newProduct);
  }

  public async updateProduct(
    id: number,
    updatedFields: Partial<Product>
  ): Promise<Product | undefined> {
    const updatedProduct = await this.productRepository.updateProduct(
      id,
      updatedFields
    );
    if (updatedProduct) {
      return updatedProduct;
    }
    return undefined;
  }

  public async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.deleteProduct(id);
  }
}
