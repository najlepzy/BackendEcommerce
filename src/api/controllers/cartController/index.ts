import { Request, Response } from "express";
import { CartManager } from "@api/managers";

export class CartController {
  private cartManager: CartManager;

  constructor() {
    this.cartManager = new CartManager();
  }

  async createCart(req: Request, res: Response): Promise<void> {
    try {
      const cart = await this.cartManager.createCart();
      res.status(201).send(cart);
    } catch (error: any) {
      console.error("Error creating cart:", error);
      res.status(500).send("Error creating cart");
    }
  }

  async listCartProducts(req: Request, res: Response): Promise<void> {
    try {
      const cartId = req.params.cid;
      const products = await this.cartManager.getCartProducts(cartId);
      res.send(products);
    } catch (error: any) {
      console.error("Error listing cart products:", error);
      res.status(500).send("Error listing cart products");
    }
  }

  async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;
      await this.cartManager.addProduct(cid, parseInt(pid));
      res
        .status(200)
        .send({ message: "Product added successfully", productId: pid });
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      if (error.message === "No carts to add products") {
        res.status(400).send({ error: error.message });
      } else if (error.message.includes("out of stock")) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(500).send("Error adding product to cart");
      }
    }
  }
}
