//   async getCarts() {
//     try {
//       const fileData = await fs.readFile(this.pathFile, "utf-8");
//       const carts = JSON.parse(fileData);
//       return carts;
//     } catch (error) {
//       throw new Error("Error al traer los carritos: " + error.message);
//     }
//   }
//   async getIndexCartById(cartId) {
//     try {
//       const carts = await this.getCarts();
//       const indexCart = carts.findIndex((cart) => cart.id === cartId);
//       if (indexCart === -1) throw new Error("Carrito no encontrado");
//       return indexCart;
//     } catch (error) {
//       throw new Error("Error al retornar el carrito: " + error.message);
//     }
//   }

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
