import "module-alias/register";
import express from "express";
import { PORT } from "./config";
import { productRouter, cartRouter } from "@api/routes";

const app = express();

app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
