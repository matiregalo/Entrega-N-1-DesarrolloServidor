import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./src/products.json");

export function configureSocket(io) {
  io.on("connection", (socket) => {
    productsHistory(socket);
    socket.on("new product", (data) => handleNewProduct(socket, io, data));
  });
}

async function productsHistory(socket) {
  try {
    const products = await productManager.getProducts();
    socket.emit("products history", products);
  } catch (error) {
    socket.emit("product error", {
      message: "Error al cargar productos: " + error.message,
    });
  }
}

async function handleNewProduct(socket, io, data) {
  try {
    const newProduct = await productManager.addProduct(data);
    io.emit("broadcast new product", newProduct);
  } catch (error) {
    socket.emit("product error", {
      message: "Error al agregar producto: " + error.message,
    });
  }
}
