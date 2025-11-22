import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: { type: String },
  code: { type: String, unique: true },
  price: { type: Number, index: true },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  stock: Number,
  category: { type: String, index: true },
  thumbnails: { type: [String], default: [] },
});
productSchema.index({ category: 1, price: 1 });

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
