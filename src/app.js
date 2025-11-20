import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectMongoDB from "./config/db.js";
import productsRouter from "./routes/products.router.js";
// import cartsRouter from "./routes/carts.router.js";
// import viewsRouter from "./routes/views.router.js";
// import { configureSocket } from "./sockets/ProductSocket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// app.set("views", "./src/views");

// configureSocket(io);

// app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);

// app.set("io", io);

connectMongoDB();

server.listen(8080, () => {
  console.log("Servidor iniciado en http://localhost:8080");
});
