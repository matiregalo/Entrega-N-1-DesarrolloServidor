import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

const getIO = (req) => req.app.get("io");

productsRouter.post("/", uploader.single("thumbnails"), async (req, res) => {
  try {
    console.log("📨 POST /products recibido");
    console.log("📁 Archivo recibido:", req.file);
    console.log("📝 Body recibido:", req.body);
    
    if (!req.file) {
      console.log("❌ No se recibió archivo");
      return res.status(400).json({ message: "Falta adjuntar la imagen al formulario" });
    }
    
    const { title, description, code, price, status, stock, category } = req.body;
    console.log("🔧 Procesando datos del producto...");
    
    const newProduct = {
      title,
      description,
      code,
      price: Number(price),
      status: status === "true" || status === true,
      stock: Number(stock),
      category,
      thumbnails: ["/img/" + req.file.filename], // ✅ Ruta correcta
    };
    
    console.log("🆕 Producto a crear:", newProduct);
    
    const product = await productManager.addProduct(newProduct);
    console.log("✅ Producto creado en el manager:", product);
    
    const io = getIO(req);
    console.log("📢 Emitiendo evento 'broadcast new product' via socket");
    io.emit("broadcast new product", product);
    
    console.log("📬 Enviando respuesta HTTP 201");
    res.status(201).json({ message: "Producto Agregado", product });
  } catch (error) {
    console.error("💥 Error en POST /products:", error);
    res.status(500).json({ message: error.message });
  }
});
productsRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    const products = await productManager.updateProductById(productId, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
