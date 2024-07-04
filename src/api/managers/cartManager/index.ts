import { CartRepository } from "@api/repositories";
import { Cart, Product } from "@api/models/cart";

export class CartManager {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async createCart(): Promise<Cart> {
    return this.cartRepository.createCart();
  }

  async getCartProducts(cartId: string): Promise<Product[]> {
    return this.cartRepository.getCartProducts(cartId);
  }

  async addProduct(cartId: string, productId: number): Promise<void> {
    const hasCarts = await this.cartRepository.hasCarts();
    if (!hasCarts) {
      throw new Error("No carts to add products");
    }
    await this.cartRepository.addProductToCart(cartId, productId);
  }
}
