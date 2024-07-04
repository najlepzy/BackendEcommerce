import express from "express";
import { ProductController } from "@api/controllers";

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get("/", productController.getAllProducts.bind(productController));
productRouter.get("/:pid", productController.getProductById.bind(productController));
productRouter.post("/", productController.addProduct.bind(productController));
productRouter.put("/:pid", productController.updateProduct.bind(productController));
productRouter.delete("/:pid", productController.deleteProduct.bind(productController));


export default productRouter;
