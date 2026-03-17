import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: "user",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-profile", async (req, res) => {
  try {
    const { email, name, newEmail, phone } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (typeof phone === "string") user.phone = phone;
    if (newEmail) user.email = newEmail;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, old password and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin: get all users (oldest signup first)
router.get("/users", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    const mapped = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      createdAt: u.createdAt,
    }));
    return res.json({ users: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load users" });
  }
});

// Admin: delete user by id
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

// Products: create
router.post("/products", async (req, res) => {
  try {
    const { name, category, price, tag, image, stock, sizes } = req.body;
    if (!name || !category || typeof price !== "number") {
      return res
        .status(400)
        .json({ message: "Name, category and price are required" });
    }

    const product = await Product.create({
      name,
      category,
      price,
      tag: tag || "New",
      image: image || "",
      stock: typeof stock === "number" ? stock : 0,
      sizes: Array.isArray(sizes) ? sizes : [],
    });

    return res.status(201).json({
      message: "Product created",
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        tag: product.tag,
        image: product.image,
        sizes: product.sizes || [],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
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
      tag: p.tag || "New",
      image: p.image || "",
      sizes: p.sizes || [],
    }));
    return res.json({ products: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load products" });
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

