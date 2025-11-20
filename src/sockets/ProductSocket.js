// import ProductManager from "../models/product.model.js";

// const productManager = new ProductManager("./src/products.json");

// export function configureSocket(io) {
//   io.on("connection", (socket) => {
//     productsHistory(socket);
//     socket.on("delete product", (productId) => {
//       handleDeleteProduct(socket, io, productId);
//     });
//   });
// }

// async function productsHistory(socket) {
//   try {
//     const products = await productManager.getProducts();
//     socket.emit("products history", products);
//   } catch (error) {
//     socket.emit("product error", {
//       message: "Error al cargar productos: " + error.message,
//     });
//   }
// }

// async function handleDeleteProduct(socket, io, productId) {
//   try {
//     const products = await productManager.deleteProductById(productId);
//     io.emit("products updated", products);
//   } catch (error) {
//     socket.emit("product error", {
//       message: "Error al borrar producto: " + error.message,
//     });
//   }
// }
