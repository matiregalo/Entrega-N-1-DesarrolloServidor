import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addProduct(newProduct) {
    try {
      await this.validateProduct(newProduct, false);
      const products = await this.getProducts();
      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);
      await this.updateJson(products);
      return product;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
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
      return products;
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async createCart(cart) {
    await this.validateProduct(cart);
    const carts = await this.getCarts();
  }
}

export default CartManager;
