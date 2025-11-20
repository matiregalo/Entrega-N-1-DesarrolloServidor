import mongoose, { Schema } from "mongoose";
import fs from "fs/promises";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  stock: Number,
  category: String,
  thumbnails: Object,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
/*
class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
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

export default ProductManager;*/
