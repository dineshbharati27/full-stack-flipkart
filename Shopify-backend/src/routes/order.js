const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


router.get('/user-orders', authMiddleware, async (req, res) => {
  try {
    // console.log("Authenticated User ID:", req.user.userId); // Check that userId is correctly extracted from the token
    const userOrders = await Order.find({ userId: req.user.userId })  // Use the userId from the token
      .populate('products.productId');  // Populate product details if necessary

    if (userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(userOrders);  // Send the user's orders
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.post("/user", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Add to Cart
router.post("/user/cart", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log("productid:", productId);

    const userId = req.user.userId; // Fix userId reference
    // console.log("userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const user = await User.findById(userId);
    // console.log("user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in cart
    const existingProduct = user.cart.find((item) => item.productId == productId);

    // if (existingProduct) {
    //   existingProduct.quantity += quantity;
    // } else {
    //   user.cart.push({ productId, quantity });
    // }

    user.cart.push({ productId });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});


//remove from cart
router.delete("/remove-from-cart", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body; // Extract productId from the request body
    const user = await User.findById(req.user.userId);
   
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove product from cart
    user.cart = user.cart.filter((item) => item.productId.toString() !== productId.toString());

    user.markModified("cart"); // Ensure Mongoose detects the change
    await user.save();

    res.status(200).json(user); // Return updated user data
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});





// Remove from Cart
// router.post("/remove-from-cart", authMiddleware, async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = await User.findById(req.user.userId);

//     user.cart = user.cart.filter((item) => item.productId !== productId);
//     await user.save();

//     res.json({ message: "Removed from cart", cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing from cart", error });
//   }
// });

// Place Order (Buy Now)
router.post("/place-order", async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingAddress } = req.body;

    const newOrder = new Order({
      userId,
     
      products,
      totalAmount,
      shippingAddress,
      orderStatus: "Processing",
    });

    // console.log(newOrder);
    

    await newOrder.save();

    // Remove only the ordered product from the cart
    const orderedProductIds = products.map((p) => p.productId);
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { productId: { $in: orderedProductIds } } },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order" });
  }
});


// Cancel Order
router.post("/cancel-order", authMiddleware, async (req, res) => {
  try {
    const { orderId, userId } = req.body;  // Get both orderId and userId from the request body

    // Find the order with both orderId and userId
    const order = await Order.findOne({ _id: orderId, userId: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or not owned by user" });
    }

    // Update the order status to "Cancelled"
    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling order", error });
  }
});



//adding product to wishlist
router.post("/add-to-wishlist", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);
    // console.log("user is",req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.wishlist.indexOf(productId);
    if (productIndex > -1) {
      user.wishlist.splice(productIndex, 1); // Remove from wishlist
    } else {
      user.wishlist.push(productId); // Add to wishlist
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//removing items from wishlist
router.post("/remove-from-wishlist", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log("product id", productId);

    const user = await User.findById(req.user.userId);
    // console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert both to strings for a proper comparison
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
    // console.log("wishlist after removal", user.wishlist);

    user.markModified("wishlist"); // Ensure Mongoose detects the change
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
