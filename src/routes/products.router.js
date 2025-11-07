import express from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

const getIO = (req) => req.app.get("io");

productsRouter.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productManager.getProductById(productId);
    res.status(200).json({ message: "Producto obtenido: ", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.delete("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const products = await productManager.deleteProductById(productId);
    res.status(200).json({ message: "Producto Eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);
    const io = getIO(req);
    io.emit("broadcast new product", product);
    res.status(201).json({ message: "Producto Agregado", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.put("/products/:productId", async (req, res) => {
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
