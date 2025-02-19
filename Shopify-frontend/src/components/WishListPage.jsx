import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService"; 
import { setUser } from "../slices/userSlice";
import { removeFromWishlist } from "../services/wishListServic";
 // Assuming you have an addToCart service

const WishlistPage = () => {
  const { user, loading, error,token } = useSelector((state) => state.user); // Fetch user from Redux
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (user && user.wishlist ) {
        try {
          const products = await Promise.all(
            user.wishlist.map(async (productId) => {
              const response = await axios.get(`https://dummyjson.com/products/${productId}`);
              return response.data;
            })
          );
          setWishlistProducts(products);
        } catch (error) {
          console.error("Error fetching wishlist products:", error);
        }
      } else {
        navigate('/login');
        setWishlistProducts([]); // Clear wishlist if it's empty
      }
    };

    fetchWishlistProducts();
  }, [user]); // Run this whenever the user changes

  const handleAddToCart = async (productId) => {
    if (user.cart.some((item) => item.productId === productId)) {
      return; // Prevent adding duplicate items
    }
  
    try {
      const updatedUser = await addToCart(productId, token, user.cart);
      dispatch(setUser({ user: updatedUser, token }));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };
  
   // Create this service

const handleRemoveFromWishlist = async (productId) => {
  try {
    const updatedUser = await removeFromWishlist(productId, token);
    dispatch(setUser({ user: updatedUser, token }));
    setWishlistProducts(wishlistProducts.filter((product) => product.id !== productId));
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    alert("Failed to remove product from wishlist.");
  }
};


  const handleBuyNow = (productId) => {
    navigate(`/placeOrder/${productId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl p-5">{error}</div>;
  }

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    return <div className="text-center text-xl p-5">Your wishlist is empty!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="space-y-4">
        {wishlistProducts.map((product, index) => (
          <div key={index} className="flex items-center space-x-4 border-b pb-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">${product.price}</p>
              <div className="mt-4 flex space-x-4">
              <button
                    className={`px-6 py-2 rounded-lg font-semibold ${
                      user.cart.some((item) => item.productId === product.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white"
                    }`}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={user.cart.some((item) => item.productId === product.id)}
                  >
                    {user.cart.some((item) => item.productId === product.id) ? "Already in Cart" : "Add to Cart"}
                  </button>

                <button
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={() => handleBuyNow(product.id)}
                >
                  Buy Now
                </button>
                <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      Remove
                    </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
