import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./src/products.json");

export function configureSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Nuevo cliente conectado:", socket.id);
    productsHistory(socket);

    // ❌ ELIMINAMOS el listener de "new product" porque ahora se hace por HTTP
    // ✅ MANTENEMOS solo el delete por socket
    socket.on("delete product", (productId) => {
      console.log("🗑️ Socket: Eliminando producto ID:", productId);
      handleDeleteProduct(socket, io, productId);
    });
    
    socket.on("disconnect", () => {
      console.log("🔌 Cliente desconectado:", socket.id);
    });
  });
}

async function productsHistory(socket) {
  try {
    console.log("📜 Enviando historial de productos al cliente:", socket.id);
    const products = await productManager.getProducts();
    socket.emit("products history", products);
    console.log("✅ Historial enviado:", products.length, "productos");
  } catch (error) {
    console.error("❌ Error enviando historial:", error);
    socket.emit("product error", {
      message: "Error al cargar productos: " + error.message,
    });
  }
}

async function handleDeleteProduct(socket, io, productId) {
  try {
    console.log("🔄 Eliminando producto ID:", productId);
    const products = await productManager.deleteProductById(productId);
    console.log("✅ Producto eliminado, nueva lista:", products.length, "productos");
    
    // ✅ Emitimos dos eventos para mayor compatibilidad
    io.emit("products updated", products);
    io.emit("product deleted", productId);
    
    console.log("📢 Eventos de eliminación emitidos");
  } catch (error) {
    console.error("❌ Error eliminando producto:", error);
    socket.emit("product error", {
      message: "Error al borrar producto: " + error.message,
    });
  }
}
