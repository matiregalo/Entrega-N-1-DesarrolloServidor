import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async validateCart(cart) {
    const requiredFields = {
      products: "object",
    };

    for (const field in cart) {
      if (!(field in requiredFields)) {
        throw new Error(`Atributo no permitido: "${field}"`);
      }
    }

    for (const [field, type] of Object.entries(requiredFields)) {
      if (field in cart) {
        if (type === "object") {
          if (!Array.isArray(cart[field])) {
            throw new Error(`El campo "${field}" debe ser un array`);
          }
          if (
            field === "products" &&
            !cart[field].every((item) => typeof item === "object")
          ) {
            throw new Error("Todos los productos deben ser objetos");
          }
        }
      }
    }
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
  async createCart(newCart) {
    try {
      await this.validateProduct(newCart);
      const carts = await this.getCarts();
      const newId = this.generateNewId();
      const cart = { id: newId, ...newCart };
      carts.push(cart);
      await this.updateJson(carts);
      return cart;
    } catch (error) {
      throw new Error("Error al añadir el nuevo carrito: " + error.message);
    }
  }
  async getProductsByCartId(cartId) {}
}

export default CartManager;
