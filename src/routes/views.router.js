import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();

const productManager = new ProductManager("./src/products.json");

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default viewsRouter;
