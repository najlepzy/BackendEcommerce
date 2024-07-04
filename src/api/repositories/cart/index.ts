import fs from "fs";
import path from "path";
import { Cart, Product } from "@api/models/cart";
import { ProductRepository } from "@api/repositories";

export class CartRepository {
  private filePath: string;
  private productRepository: ProductRepository;

  constructor(
    filePath: string = path.join(__dirname, "../../data/carts.json")
  ) {
    this.filePath = filePath;
    this.productRepository = new ProductRepository(
      path.join(__dirname, "../../data/products.json")
    );
    this.ensureDirectory();
  }

  private ensureDirectory() {
    const dirPath = path.dirname(this.filePath);
    !fs.existsSync(dirPath) ? fs.mkdirSync(dirPath, { recursive: true }) : null;
  }

  async createCart(): Promise<Cart> {
    const carts = await this.readCarts(true);
    const id = this.generateNextId(carts);
    const newCart: Cart = { id: id.toString(), products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  private generateNextId(carts: Cart[]): string {
    const maxId = carts.reduce(
      (max, cart) => Math.max(max, parseInt(cart.id)),
      0
    );
    return (maxId + 1).toString();
  }

  private async readCarts(createIfNotExists = false): Promise<Cart[]> {
    !fs.existsSync(this.filePath) && createIfNotExists
      ? fs.writeFileSync(this.filePath, JSON.stringify([]))
      : null;

    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const data = await fs.promises.readFile(this.filePath, "utf8");
    return JSON.parse(data);
  }

  private async saveCarts(carts: Cart[]): Promise<void> {
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
  }

  async getCartProducts(cartId: string): Promise<Product[]> {
    const carts = await this.readCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    return cart ? cart.products : [];
  }

  async addProductToCart(cartId: string, productId: number): Promise<void> {
    const carts = await this.readCarts();
    if (carts.length === 0) {
      throw new Error("No carts to add products");
    }
    const cart = carts.find((cart) => cart.id === cartId);
    if (cart) {
      const product = await this.productRepository.findProductById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const productInCart = cart.products.find(
        (p) => p.productId === productId
      );

      const quantityInCart = productInCart ? productInCart.quantity : 0;

      if (quantityInCart >= product.stock) {
        throw new Error(`Product ${product.title} is out of stock`);
      }

      productInCart
        ? (productInCart.quantity += 1)
        : cart.products.push({ productId, quantity: 1 });

      await this.saveCarts(carts);
    }
  }

  public async hasCarts(): Promise<boolean> {
    const carts = await this.readCarts();
    return carts.length > 0;
  }
}
