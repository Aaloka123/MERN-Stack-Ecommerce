import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Setting from "../models/Setting.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create order from current cart (user checkout)
router.post("/orders", async (req, res) => {
  try {
    const { email, shippingAddress } = req.body;
    const userEmail = (email || "").trim().toLowerCase();
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const storeSetting = await Setting.findOne().lean();
    if (storeSetting?.storeClosed) {
      return res.status(403).json({ message: "Store is closed. Checkout is unavailable." });
    }

    const cart = await Cart.findOne({ userEmail });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check and update stock for each product in the cart
    // First, verify that all products exist and have enough stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.name} is no longer available.` });
      }
      const available = typeof product.stock === "number" ? product.stock : 0;
      if (available < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${available}, requested: ${item.qty}.`,
        });
      }
    }

    // All good: decrement stock for each product
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const available = typeof product.stock === "number" ? product.stock : 0;
      product.stock = Math.max(0, available - item.qty);
      await product.save();
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.13);
    const total = subtotal + tax;

    const order = await Order.create({
      userEmail,
      items: cart.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image || "",
      })),
      subtotal,
      tax,
      total,
      status: "pending",
      shippingAddress: typeof shippingAddress === "string" ? shippingAddress.trim() : "",
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order._id.toString(),
        userEmail: order.userEmail,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to place order" });
  }
});

// List orders – with ?email= returns that user's orders; without email returns all (admin)
router.get("/orders", async (req, res) => {
  try {
    const email = (req.query.email || "").trim().toLowerCase();
    const filter = email ? { userEmail: email } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    const list = orders.map((o) => ({
      id: o._id.toString(),
      userEmail: o.userEmail,
      items: o.items,
      subtotal: o.subtotal,
      tax: o.tax,
      total: o.total,
      status: o.status,
      shippingAddress: o.shippingAddress || "",
      createdAt: o.createdAt,
    }));
    return res.json({ orders: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load orders" });
  }
});

// User: cancel own order (only when pending or confirmed)
router.patch("/orders/:id/cancel", async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = (email || "").trim().toLowerCase();
    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const order = await Order.findOne({ _id: req.params.id, userEmail });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Only pending or confirmed orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    return res.json({
      success: true,
      order: { id: order._id.toString(), status: order.status },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to cancel order" });
  }
});

// Get one order by id (admin)
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({
      order: {
        id: order._id.toString(),
        userEmail: order.userEmail,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        shippingAddress: order.shippingAddress || "",
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load order" });
  }
});

// Update order status (admin)
router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentIndex = allowed.indexOf(order.status);
    const nextIndex = allowed.indexOf(status);

    // Only allow moving forward in the flow: pending -> confirmed -> shipped -> delivered/cancelled
    if (nextIndex <= currentIndex) {
      return res
        .status(400)
        .json({ message: "Order status can only move forward, not back." });
    }

    order.status = status;
    await order.save();

    return res.json({
      success: true,
      order: {
        id: order._id.toString(),
        status: order.status,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;
