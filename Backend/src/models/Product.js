import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    tag: { type: String, default: "New" },
    image: { type: String, default: "" },
    sizes: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

