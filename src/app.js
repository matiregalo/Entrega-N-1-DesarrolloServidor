import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



server.listen(8080, () => {
  console.log("Servidor iniciado correctamente en el puerto 8080");
});
