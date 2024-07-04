import fs from "fs";
import path from "path";
import { Product } from "@api/models";

export class ProductRepository {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureDataStore();
  }

  private async ensureDataStore() {
    const dirPath = path.dirname(this.filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  public async readProducts(): Promise<Product[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading products:", error);
      return [];
    }
  }

  public async writeProducts(products: Product[]): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(products, null, 2)
      );
    } catch (error) {
      console.error("Error writing products:", error);
    }
  }

  public async findProductById(id: number): Promise<Product | undefined> {
    const products = await this.readProducts();
    return products.find((product) => product.id === id);
  }

  public async addProduct(product: Product): Promise<void> {
    const products = await this.readProducts();
    products.push(product);
    await this.writeProducts(products);
  }

  public async addProductWithoutId(
    product: Omit<Product, "id">
  ): Promise<void> {
    const products = await this.readProducts();
    const newId = products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
    const newProduct: Product = { ...product, id: newId, status: true };
    products.push(newProduct);
    await this.writeProducts(products);
  }

  public async updateProduct(
    id: number,
    updatedFields: Partial<Product>
  ): Promise<Product | undefined> {
    const products = await this.readProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) return undefined;

    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;
    await this.writeProducts(products);

    return updatedProduct;
  }

  public async deleteProduct(id: number): Promise<boolean> {
    const products = await this.readProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) return false;

    products.splice(productIndex, 1);
    await this.writeProducts(products);
    return true;
  }
}
