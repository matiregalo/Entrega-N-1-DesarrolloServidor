import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

// // viewsRouter.get("/realtimeproducts", async (req, res) => {
// //   try {
// //     const products = await productManager.getProducts();
// //     res.render("realTimeProducts", { products });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category } = req.query;
    const data = await Product.paginate(category, { limit, page, lean: true });
    const products = data.docs;
    delete data.docs;
    const links = [];
    for (let i = 1; i <= data.totalPages; i++) {
      queryParams.set("page", i);
      links.push({ text: i, link: `?${queryParams.toString()}` });
    }
    res.render("home", { products, links, selectedCategory: category || "all" });
  } catch (error) {
    res.status(500).render("error", {
      errors: [
        {
          code: 500,
          message: error.message || "Error al cargar los productos",
        },
      ],
    });
  }
});

export default viewsRouter;
