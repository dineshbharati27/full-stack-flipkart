import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/userSlice";
import { removeFromCart } from "../services/cartService"; // Import Redux action

const CartPage = () => {
  const { user, loading, error, token ,} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (user && user.cart ) {
        try {
          const products = await Promise.all(
            user.cart.map(async (cartItem) => {
              const response = await axios.get(`https://dummyjson.com/products/${cartItem.productId}`);
              return { ...cartItem, product: response.data };
            })
          );
          setCartProducts(products);
        } catch (error) {
          console.error("Error fetching cart products:", error);
        }
      } else {
        navigate('/login');
        setCartProducts([]); // Clear cart if it's empty
      }
    };

    fetchCartProducts();
  }, [user]);

  const navigate = useNavigate();

  const handleBuyNow = (productId) => {
    navigate(`/placeOrder/${productId}`);
  };

  // Import the removeFromCart function

  const handleRemoveFromCart = async (productId) => {
    try {
      const updatedUser = await removeFromCart(productId, token); // Call existing function
      dispatch(setUser({ user: updatedUser, token })); // Update Redux store
      // console.log(updatedUser);
      
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl p-5">{error}</div>;
  }

  if (!user || !user.cart || user.cart.length === 0) {
    return <div className="text-center text-xl p-5">Your cart is empty!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="space-y-4">
        {cartProducts.map((cartItem, index) => (
          <div key={index} className="flex items-center space-x-4 border-b pb-4">
            <img
              src={cartItem.product.thumbnail}
              alt={cartItem.product.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{cartItem.product.title}</h2>
              <p className="text-sm text-gray-600">{cartItem.product.description}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">${cartItem.product.price}</p>
              {/* <p className="text-sm text-gray-600">Quantity: {cartItem.quantity}</p> */}
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={() => handleBuyNow(cartItem.product.id)}
                >
                  Buy Now
                </button>
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={() => handleRemoveFromCart(cartItem.product.id)}
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

export default CartPage;
