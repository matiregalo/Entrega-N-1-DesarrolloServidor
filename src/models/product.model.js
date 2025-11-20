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
    default: Date.now,
  },
  stock: Number,
  category: String,
  thumbnails: Object,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
/*
  
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
*/
