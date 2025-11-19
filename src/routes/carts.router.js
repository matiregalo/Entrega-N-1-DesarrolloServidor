import express from "express";
import CartManager from "../CartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/carts.json");

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ message: "Carrito Creado", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.get("/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const products = await cartManager.getProductsByCartId(cartId);
    res.status(200).json({ message: "Productos en el carrito: ", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const { quantity = 1 } = req.body;
    const cart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity,
    );
    res.status(200).json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
