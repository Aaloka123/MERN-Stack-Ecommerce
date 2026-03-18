import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Products: create
router.post("/products", async (req, res) => {
  try {
    const { name, category, price, image, images, stock, sizes, description } = req.body;
    if (!name || !category || typeof price !== "number") {
      return res
        .status(400)
        .json({ message: "Name, category and price are required" });
    }

    const imageArray = Array.isArray(images)
      ? images.filter(Boolean).slice(0, 4)
      : image
      ? [image]
      : [];

    const product = await Product.create({
      name,
      category,
      price,
      image: imageArray[0] || "",
      images: imageArray,
      stock: typeof stock === "number" ? stock : 0,
      sizes: Array.isArray(sizes) ? sizes : [],
      description: typeof description === "string" ? description : "",
    });

    return res.status(201).json({
      message: "Product created",
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        images: product.images || (product.image ? [product.image] : []),
        description: product.description || "",
        sizes: product.sizes || [],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// Products: update by id (admin)
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, image, images, stock, sizes, description } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (typeof name === "string" && name.trim()) product.name = name.trim();
    if (typeof category === "string" && category.trim())
      product.category = category.trim();
    if (typeof price === "number" && !Number.isNaN(price) && price > 0)
      product.price = price;
    if (typeof stock === "number" && Number.isInteger(stock) && stock >= 0)
      product.stock = stock;
    if (Array.isArray(sizes)) product.sizes = sizes;
    if (typeof description === "string") product.description = description;

    const imageArray = Array.isArray(images)
      ? images.filter(Boolean).slice(0, 4)
      : image
      ? [image]
      : product.images && product.images.length
      ? product.images
      : product.image
      ? [product.image]
      : [];

    product.image = imageArray[0] || "";
    product.images = imageArray;

    await product.save();

    return res.json({
      message: "Product updated",
      product: {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image || "",
        images:
          product.images && product.images.length
            ? product.images
            : product.image
            ? [product.image]
            : [],
        description: product.description || "",
        sizes: product.sizes || [],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// Products: list all (for shop/new)
router.get("/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const mapped = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image || "",
      images: p.images && p.images.length ? p.images : p.image ? [p.image] : [],
      description: p.description || "",
      sizes: p.sizes || [],
    }));
    return res.json({ products: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load products" });
  }
});

// Products: get single by id
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      product: {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image || "",
        images:
          (product.images && product.images.length
            ? product.images
            : product.image
            ? [product.image]
            : []),
        description: product.description || "",
        sizes: product.sizes || [],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load product" });
  }
});

// Products: delete by id (admin)
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
