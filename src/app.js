import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { configureSocket } from "./sockets/ProductSocket.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

configureSocket(io);

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.set("io", io);

const connectMongoDB = async()=>{
  try {
    await mongoose.connect("mongodb+srv://coder:mHTdZgDPws70dLNS@ecommerce-cluster.uri2xql.mongodb.net/myEcommerce?appName=Ecommerce-cluster")
    console.log("Conectado con MONGODB")
  } catch (error) {
    console.log("Error al conectar con MongoDB" + error)
  }
}

connectMongoDB()

server.listen(8080, () => {
  console.log("Servidor iniciado en http://localhost:8080");
});
