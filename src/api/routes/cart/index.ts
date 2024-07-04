import express from "express";
import { CartController } from "@api/controllers";

const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.post("/", cartController.createCart.bind(cartController));
cartRouter.get("/:cid", cartController.listCartProducts.bind(cartController));
cartRouter.post("/:cid/product/:pid", cartController.addProductToCart.bind(cartController));

export default cartRouter;
