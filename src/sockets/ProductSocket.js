import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./src/products.json");
console.log("🟢 ProductSocket.js inicializado");

export function configureSocket(io) {
  io.on("connection", (socket) => {
    console.log("👤 Nuevo cliente conectado:", socket.id);
    console.log("📊 Clientes conectados:", io.engine.clientsCount);

    productsHistory(socket);
    
    socket.on("new product", (data) => {
      console.log("📨 'new product' recibido de", socket.id);
      console.log("📦 Datos del producto:", data);
      handleNewProduct(socket, io, data);
    });
    
    socket.on("delete product", (productId) => {
      console.log("🗑️ 'delete product' recibido de", socket.id);
      console.log("🎯 ID a eliminar:", productId);
      handleDeleteProduct(socket, io, productId);
    });

    socket.on("disconnect", (reason) => {
      console.log("👋 Cliente desconectado:", socket.id, "Razón:", reason);
    });
  });
}

async function productsHistory(socket) {
  try {
    console.log("📖 Enviando historial de productos a", socket.id);
    const products = await productManager.getProducts();
    console.log("📚 Productos encontrados en JSON:", products.length);
    socket.emit("products history", products);
    console.log("✅ Historial enviado a", socket.id);
  } catch (error) {
    console.error("💥 Error al cargar productos:", error);
    socket.emit("product error", {
      message: "Error al cargar productos: " + error.message,
    });
  }
}

async function handleNewProduct(socket, io, data) {
  try {
    console.log("🔄 Procesando nuevo producto...");
    const newProduct = await productManager.addProduct(data);
    console.log("✅ Producto agregado exitosamente:", newProduct.id);
    console.log("📢 Emitiendo a todos los clientes...");
    io.emit("broadcast new product", newProduct);
    console.log("🎉 Producto broadcasted a todos los clientes");
  } catch (error) {
    console.error("💥 Error al agregar producto:", error);
    socket.emit("product error", {
      message: "Error al agregar producto: " + error.message,
    });
  }
}

async function handleDeleteProduct(socket, io, productId) {
  try {
    console.log("🔄 Eliminando producto ID:", productId);
    const products = await productManager.deleteProductById(productId);
    console.log("✅ Producto eliminado. Total restante:", products.length);
    console.log("📢 Emitiendo lista actualizada...");
    io.emit("products updated", products);
    // También emitir evento específico de eliminación
    io.emit("product deleted", productId);
    console.log("🗑️ Lista actualizada enviada a todos los clientes");
  } catch (error) {
    console.error("💥 Error al borrar producto:", error);
    socket.emit("product error", {
      message: "Error al borrar producto: " + error.message,
    });
  }
}