import Cart from "../models/cart.model.js";
import express from "express";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ message: "Carrito Creado", payload: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity = 1 } = req.body;
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      {
        $push: { products: { product: productId, quantity } },
      },
      { new: true, runValidators: true },
    );
    res
      .status(200)
      .json({ message: "Producto agregado al carrito", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.get("/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId).populate("products.product");
    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });
    res
      .status(200)
      .json({ message: "Productos en el carrito: ", payload: cart.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
