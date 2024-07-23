import { Router } from "express";
import { ProductController } from "@api/controllers";
import { Server as IOServer } from "socket.io";

const handlebarsRouter = (io: IOServer) => {
  const router = Router();
  const productController = new ProductController(io);

  router.get("/", productController.renderProductsPage.bind(productController));
  router.get(
    "/realtimeproducts",
    productController.renderRealTimeProductsPage.bind(productController)
  );

  return router;
};

export default handlebarsRouter;
