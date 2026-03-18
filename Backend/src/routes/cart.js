import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Setting from "../models/Setting.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get cart for user (by email)
router.get("/cart", requireAuth, async (req, res) => {
  try {
    const tokenEmail = req.user.email;
    const emailFromClient = (req.query.email || "").trim().toLowerCase();
    if (emailFromClient && emailFromClient !== tokenEmail) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let cart = await Cart.findOne({ userEmail: tokenEmail });
    if (!cart) {
      cart = await Cart.create({ userEmail: tokenEmail, items: [] });
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const stock = typeof product?.stock === "number" ? product.stock : 0;
        return {
          id: item._id.toString(),
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          image: item.image || "",
          qty: item.qty,
          stock,
        };
      })
    );

    return res.json({
      cart: { items, itemCount, userEmail: cart.userEmail },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load cart" });
  }
});

// Add to cart or increase qty
router.post("/cart/add", requireAuth, async (req, res) => {
  try {
    const storeSetting = await Setting.findOne().lean();
    if (storeSetting?.storeClosed) {
      return res.status(403).json({ message: "Store is closed. You cannot add items to cart." });
    }

    const { email, productId, qty = 1 } = req.body;
    const addQty = Math.max(1, typeof qty === "number" ? qty : 1);
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const userEmail = req.user.email;
    const emailFromClient = email ? String(email).trim().toLowerCase() : "";
    if (emailFromClient && emailFromClient !== userEmail) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const maxStock = typeof product.stock === "number" ? Math.max(0, product.stock) : 0;
    if (maxStock === 0) {
      return res.status(400).json({ message: "This product is out of stock" });
    }

    let cart = await Cart.findOne({ userEmail });
    if (!cart) {
      cart = await Cart.create({ userEmail, items: [] });
    }

    const existing = cart.items.find(
      (i) => i.productId && i.productId.toString() === productId
    );
    let addedQty;
    if (existing) {
      const canAdd = Math.max(0, maxStock - existing.qty);
      addedQty = Math.min(addQty, canAdd);
      existing.qty += addedQty;
    } else {
      addedQty = Math.min(addQty, maxStock);
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || "",
        qty: addedQty,
      });
    }
    await cart.save();

    const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const p = await Product.findById(item.productId);
        const stock = typeof p?.stock === "number" ? p.stock : 0;
        return {
          id: item._id.toString(),
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          image: item.image || "",
          qty: item.qty,
          stock,
        };
      })
    );

    return res.json({
      message: addedQty < addQty ? "Added to cart (limited by stock)" : "Added to cart",
      cart: { items, itemCount, userEmail: cart.userEmail },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Update item qty (or remove if qty <= 0)
router.put("/cart/item", requireAuth, async (req, res) => {
  try {
    const { email, productId, qty } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const userEmail = req.user.email;
    const emailFromClient = email ? String(email).trim().toLowerCase() : "";
    if (emailFromClient && emailFromClient !== userEmail) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    let cart = await Cart.findOne({ userEmail });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findById(productId);
    const maxStock = product && typeof product.stock === "number" ? Math.max(0, product.stock) : 0;

    if (typeof qty === "number" && qty <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId && i.productId.toString() !== productId
      );
    } else {
      let numQty = Math.max(1, typeof qty === "number" ? qty : 1);
      if (maxStock > 0 && numQty > maxStock) numQty = maxStock;
      const item = cart.items.find(
        (i) => i.productId && i.productId.toString() === productId
      );
      if (item) item.qty = numQty;
    }
    await cart.save();

    const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const p = await Product.findById(item.productId);
        const stock = typeof p?.stock === "number" ? p.stock : 0;
        return {
          id: item._id.toString(),
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          image: item.image || "",
          qty: item.qty,
          stock,
        };
      })
    );

    return res.json({
      message: "Cart updated",
      cart: { items, itemCount, userEmail: cart.userEmail },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update cart" });
  }
});

// Remove one product from cart
router.delete("/cart/item", requireAuth, async (req, res) => {
  try {
    const tokenEmail = req.user.email;
    const email = (req.query.email || req.body.email || "").trim().toLowerCase();
    const productId = req.query.productId || req.body.productId;
    if (!email || !productId) {
      // email can be omitted; token decides the user
      if (!productId) {
        return res.status(400).json({ message: "productId is required" });
      }
    }

    if (email && email !== tokenEmail) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let cart = await Cart.findOne({ userEmail: tokenEmail });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.productId && i.productId.toString() !== productId
    );
    await cart.save();

    const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const p = await Product.findById(item.productId);
        const stock = typeof p?.stock === "number" ? p.stock : 0;
        return {
          id: item._id.toString(),
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          image: item.image || "",
          qty: item.qty,
          stock,
        };
      })
    );

    return res.json({
      message: "Item removed",
      cart: { items, itemCount, userEmail: cart.userEmail },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
});

export default router;
