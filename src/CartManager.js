import fs from "fs/promises";
import crypto from "crypto";
import ProductManager from "./ProductManager.js";

class CartManager {
  productManager = new ProductManager("./src/products.json");

  constructor(pathFile) {
    this.pathFile = pathFile;
  }
  generateNewId() {
    return crypto.randomUUID();
  }

  async getCarts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);
      return carts;
    } catch (error) {
      throw new Error("Error al traer los carritos: " + error.message);
    }
  }
  async updateJson(carts) {
    try {
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8",
      );
    } catch (error) {
      throw new Error("Error al modificar el archivo: " + error.message);
    }
  }
  async createCart() {
    try {
      const carts = await this.getCarts();
      const newId = this.generateNewId();
      const cart = { id: newId, products: [] };
      carts.push(cart);
      await this.updateJson(carts);
      return cart;
    } catch (error) {
      throw new Error("Error al añadir el nuevo carrito: " + error.message);
    }
  }
  async getIndexCartById(cartId) {
    try {
      const carts = await this.getCarts();
      const indexCart = carts.findIndex((cart) => cart.id === cartId);
      if (indexCart === -1) throw new Error("Carrito no encontrado");
      return indexCart;
    } catch (error) {
      throw new Error("Error al retornar el carrito: " + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      await this.productManager.getProductById(productId);
      const carts = await this.getCarts();
      const indexCart = await this.getIndexCartById(cartId);
    //     const indexCart = carts.findIndex((cart) => cart.id === cartId);
    //   if (indexCart === -1) throw new Error("Carrito no encontrado");
      const cart = carts[indexCart];
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product === productId,
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
        await this.updateJson(carts);
        return cart;
      } else {
        cart.products.push({
          product: productId,
          quantity,
        });
        await this.updateJson(carts);
        return cart;
      }
    } catch (error) {
      throw new Error(
        "Error al agregar el producto al carrito: " + error.message,
      );
    }
  }

  async getProductsByCartId(cartId) {
    try {
      const carts = await this.getCarts();
      const indexCart = await this.getIndexCartById(cartId);
    //     const indexCart = carts.findIndex((cart) => cart.id === cartId);
    //   if (indexCart === -1) throw new Error("Carrito no encontrado");
    return carts[indexCart].products;
    } catch (error) {
      throw new Error(
        "Error al obtener productos del carrito: " + error.message,
      );
    }
  }
}

export default CartManager;
