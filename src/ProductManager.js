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
      const products = JSON.parse(fileData);
      return products;
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async addProduct(newProduct) {
    try {
      const products = await this.getProducts();
      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);
      await this.updateJson(products);
      return products;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }
  async updateProductById(productId, updates) {
    try {
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
      const indexProduct = products.findIndex(
        (product) => product.id === productId,
      );
      if (indexProduct === -1) throw new Error("Producto no encontrado");
      const filteredProducts = products.filter(
        (product) => product.id !== productId,
      );
      await this.updateJson(filteredProducts);
      return filteredProducts;
    } catch (error) {
      throw new Error("Error al borrar el producto: " + error.message);
    }
  }
}

async function main() {
  try {
    const productManager = new ProductManager("./src/products.json");
    // await productManager.addProduct({
    //   title: "Hola como estas vos",
    //   price: 1500,
    //   stock: 10,
    // });
    //const products = await productManager.getProducts();
    //await productManager.updateProductById("e0c44caf-8802-45ad-bbe4-544d82f1d349", {price : 1800})
    await productManager.deleteProductById(
      "e0c44caf-8802-45ad-bbe4-544d82f1d349",
    );
  } catch (error) {
    console.log(error);
  }
}

main();
