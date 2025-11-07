import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async updateJson(products) {
    try {
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8",
      );
    } catch (error) {
      throw new Error("Error al modificar el archivo: " + error.message);
    }
  }

  async getProducts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async validateProduct(product, isUpdate = false) {
    const requiredFields = {
      title: "string",
      description: "string",
      code: "string",
      price: "number",
      status: "boolean",
      stock: "number",
      category: "string",
      thumbnails: "object",
    };

    for (const field in product) {
      if (!(field in requiredFields)) {
        throw new Error(`Atributo no permitido: "${field}"`);
      }
    }

    if (!isUpdate) {
      for (const field in requiredFields) {
        if (!(field in product)) {
          throw new Error(`El campo "${field}" es requerido`);
        }
      }
    }

    for (const [field, type] of Object.entries(requiredFields)) {
      if (field in product) {
        if (type === "object") {
          if (!Array.isArray(product[field])) {
            throw new Error(`El campo "${field}" debe ser un array`);
          }
          if (
            field === "thumbnails" &&
            !product[field].every((item) => typeof item === "string")
          ) {
            throw new Error(
              "Todos los elementos de thumbnails deben ser strings",
            );
          }
        } else if (typeof product[field] !== type) {
          throw new Error(`El campo "${field}" debe ser de tipo ${type}`);
        }
      }
    }
  }

  async addProduct(newProduct) {
    try {
      await this.validateProduct(newProduct, false);
      const products = await this.getProducts();
      const product = { id: this.generateNewId(), ...newProduct };
      products.push(product);
      await this.updateJson(products);
      return product;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async updateProductById(productId, updates) {
    try {
      await this.validateProduct(updates, true);
      const products = await this.getProducts();
      const indexProduct = products.findIndex(
        (product) => product.id === productId,
      );
      if (indexProduct === -1) throw new Error("Producto no encontrado");
      products[indexProduct] = { ...products[indexProduct], ...updates };
      await this.updateJson(products);
      return products;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductById(productId) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(
        (product) => product.id !== productId,
      );
      if (filteredProducts.length === products.length)
        throw new Error("Producto no encontrado");
      await this.updateJson(filteredProducts);
      return filteredProducts;
    } catch (error) {
      throw new Error("Error al borrar el producto: " + error.message);
    }
  }
  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === productId);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error("Error al retornar el producto: " + error.message);
    }
  }
}

export default ProductManager;
