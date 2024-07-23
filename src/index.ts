import "module-alias/register";
import express from "express";
import { createServer } from "http";
import { PORT } from "./config";
import { productRouter, cartRouter, handlebarsRouter } from "@api/routes";
import setupSocket from "@api/services/socketIo/index.service";
import { setupHandlebars } from "./config/handlebars";

const app = express();
const server = createServer(app);

const io = setupSocket(server);

app.use(express.json());
setupHandlebars(app);

app.use(express.static("public"));

// Rutas
app.use("/", handlebarsRouter(io));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Inicialización del servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
