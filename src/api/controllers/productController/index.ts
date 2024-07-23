import { Request, Response } from "express";
import { ProductManager } from "@api/managers";
import { Server as IOServer } from "socket.io";

export class ProductController {
  private productManager: ProductManager;
  private io?: IOServer;

  constructor(io?: IOServer) {
    this.io = io;
    this.productManager = new ProductManager(io!);
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productManager.readProducts();
      const limit = parseInt(req.query.limit as string) || products.length;
      res.send(products.slice(0, limit));
    } catch (error) {
      console.error("Error reading products:", error);
      res.status(500).send("Error reading products");
    }
  }

  async renderProductsPage(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productManager.readProducts();
      res.render("home", { title: "Home", products });
    } catch (error) {
      console.error("Error reading products:", error);
      res.status(500).send("Error reading products");
    }
  }

  async renderRealTimeProductsPage(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productManager.readProducts();
      res.render("realTimeProducts", { title: "Real-Time", products });
    } catch (error) {
      console.error("Error reading products:", error);
      res.status(500).send("Error reading products");
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.pid);
      isNaN(productId)
        ? res.status(400).send("Invalid product ID")
        : res.send(
            (await this.productManager.getProductById(productId)) ||
              "Product not found"
          );
    } catch (error) {
      console.error("Error reading product by ID:", error);
      res.status(500).send("Error reading products");
    }
  }

  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productManager.addProduct(req.body);
      this.io?.emit("product_added", product);
      res.status(201).send("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Error adding product");
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.pid);
      isNaN(productId)
        ? res.status(400).send("Invalid product ID")
        : "id" in req.body
        ? res.status(400).send("Cannot modify product ID")
        : res.send(
            (await this.productManager.updateProduct(productId, req.body)) ||
              "Product not found"
          );
      this.io?.emit("product_updated", { id: productId, ...req.body }); 
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error updating product");
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.pid);
      isNaN(productId)
        ? res.status(400).send("Invalid product ID")
        : (await this.productManager.deleteProduct(productId))
        ? res.status(200).send("Product deleted successfully")
        : res.status(404).send("Product not found");
      this.io?.emit("product_deleted", productId); // Emite el evento
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error deleting product");
    }
  }
}
