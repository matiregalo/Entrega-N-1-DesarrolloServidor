import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, sort } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    let sortOption = {};
    if (sort === "price:asc") {
      sortOption = { price: 1 };
    } else if (sort === "price:desc") {
      sortOption = { price: -1 };
    } else {
      sortOption = { created_at: -1 };
    }
    const categories = await Product.distinct("category");
    const data = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
      sort: sortOption,
    });

    const products = data.docs;
    delete data.docs;
    const links = [];
    const queryParams = new URLSearchParams();
    if (limit) queryParams.set("limit", limit);
    if (category && category !== "all") queryParams.set("category", category);
    if (sort) queryParams.set("sort", sort);

    for (let i = 1; i <= data.totalPages; i++) {
      queryParams.set("page", i);
      links.push({ text: i, link: `?${queryParams.toString()}` });
    }

    res.render("home", {
      products,
      links,
      categories,
      selectedCategory: category || "all",
      selectedSort: sort || "default",
    });
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
