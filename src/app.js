import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productManager.getProductById(productId);
    res.status(200).json({ message: "Producto obtenido: ", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const products = await productManager.deleteProductById(productId);
    res.status(200).json({ message: "Producto Eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto Agregado", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    const products = await productManager.updateProductById(productId, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/carts", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ message: "Carrito Creado", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/carts/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const products = await cartManager.getProductsByCartId(cartId);
    res.status(200).json({ message: "Productos en el carrito: ", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/carts/:cartId/products/:productId", async (req, res) => {
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

app.listen(8080, () => {
  console.log("Servidor iniciado correctamente en el puerto 8080");
});
