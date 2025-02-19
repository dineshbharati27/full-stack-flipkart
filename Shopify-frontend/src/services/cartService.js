import axios from "axios";

const ADD_TO_CART = "http://localhost:5000/api/user/cart";  // Replace with your actual API base URL

// Function to add product to cart
export const addToCart = async (productId, userToken, userCart) => {
  // Ensure cart is an array, even if it's null or undefined
  const cart = Array.isArray(userCart) ? userCart : [];

  // Check if the product is already in the user's cart
  const productInCart = cart.find((item) => item.productId === productId);

  try {
    if (productInCart) {
      // If the product is already in the cart, update its quantity
      const response = await axios.put(
        `${ADD_TO_CART}/${productId}`,
        // { quantity: productInCart.quantity + 1 },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return response.data; // Return updated user data
    } else {
      // If product is not in cart, add it
      const response = await axios.post(
        ADD_TO_CART,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`  // Make sure the token is passed here
          }
        }
      );
      
      return response.data; // Return updated user data
    }
  } catch (error) {
    throw new Error("Error adding product to cart: " + error.message);
  }
};


const REMOVE_FROM_CART = "http://localhost:5000/api/remove-from-cart"; 

export const removeFromCart = async (productId, userToken) => {
  try {
    const response = await axios.delete(REMOVE_FROM_CART, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      data: { productId }, // Send productId in the request body
    });

    return response.data; 
    // Return updated user data
  } catch (error) {
    throw new Error("Error removing product from cart: " + error.message);
  }
};
