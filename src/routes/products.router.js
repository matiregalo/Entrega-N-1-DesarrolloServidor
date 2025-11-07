import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

const getIO = (req) => req.app.get("io");

productsRouter.get("/", async (req, res) => {
  try {
    console.log("Solicitando lista de productos");
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: error.message });
  }
});

productsRouter.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log("Solicitando producto ID:", productId);
    const product = await productManager.getProductById(productId);
    res.status(200).json({ message: "Producto obtenido: ", product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: error.message });
  }
});

productsRouter.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log("Eliminando producto ID:", productId);
    const products = await productManager.deleteProductById(productId);
    const io = getIO(req);
    io.emit("product deleted", productId);
    res.status(200).json({ message: "Producto Eliminado", products });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: error.message });
  }
});

productsRouter.post("/", uploader.single("thumbnails"), async (req, res) => {
  try {
    console.log("Creando nuevo producto");
    const newProduct = req.body;

    // Si hay archivo subido, agregar el nombre del archivo a thumbnails
    if (req.file) {
      newProduct.thumbnails = [req.file.filename];
    } else {
      newProduct.thumbnails = [];
    }

    console.log("Datos del producto:", newProduct);
    const product = await productManager.addProduct(newProduct);
    const io = getIO(req);
    io.emit("broadcast new product", product);
    res.status(201).json({ message: "Producto Agregado", product });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: error.message });
  }
});

productsRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    console.log("Actualizando producto ID:", productId, "con:", updates);
    const products = await productManager.updateProductById(productId, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
