import axios from "axios";

// Function to toggle the product in the wishlist (add/remove)
export const toggleWishlist = async (productId, token, callback) => {
  try {
    const response = await fetch("http://localhost:5000/api/add-to-wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is sent here
      },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      callback(updatedUser); // Call the callback with updated user data
    } else {
      const errorData = await response.json();
      console.error("Error updating wishlist:", errorData.message);
    }
  } catch (error) {
    console.error("Error during wishlist update:", error);
  }
};

export const removeFromWishlist = async (productId, token) => {
  const response = await axios.post(
    "http://localhost:5000/api/remove-from-wishlist",
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

