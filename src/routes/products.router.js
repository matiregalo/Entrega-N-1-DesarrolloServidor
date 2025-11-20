import express from "express";
import uploader from "../utils/uploader.js";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

// const getIO = (req) => req.app.get("io");

productsRouter.post(
  "/",
  //uploader.single("thumbnails"),
  async (req, res) => {
    try {
      // if (!req.file) {
      //   return res
      //     .status(400)
      //     .json({ message: "Falta adjuntar la imagen al formulario" });
      // }

      const { title, description, code, price, status, stock, category } =
        req.body;

      const newProduct = {
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
        //thumbnails: ["/img/" + req.file.filename],
      };
      const product = new Product(newProduct);
      await product.save();
      // const io = getIO(req);
      // io.emit("broadcast new product", product);
      res.status(201).json({ message: "Producto Agregado", payload: product });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el producto" });
    }
  },
);
productsRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });
    res
      .status(200)
      .json({ message: "Producto Actualizado", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

productsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "Lista de productos", payload: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// productsRouter.get("/:productId", async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const product = await productManager.getProductById(productId);
//     res.status(200).json({ message: "Producto obtenido: ", product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

productsRouter.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });
    res
      .status(200)
      .json({ message: "Producto Eliminado", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error al borrar el producto" });
  }
});

export default productsRouter;
