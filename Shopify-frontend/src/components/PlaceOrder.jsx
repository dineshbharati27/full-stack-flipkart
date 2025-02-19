import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { placeOrder } from "../slices/orderSlice";
import axios from "axios";
import { fetchUser, setUser } from "../slices/userSlice";


const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, token } = useSelector((state) => state.user);
  const cart = user?.cart || [];

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedSize, setSelectedSize] = useState({});
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      if (user?.address) {
        setSelectedAddress(user.address);
      }
  
      // console.log("Product ID from useParams:", productId);
      // console.log("Cart Data from Redux:", cart);
  
      // const filteredCartItems = cart.filter((item) => String(item.productId) === String(productId));
      // console.log("Filtered Cart Items:", filteredCartItems);
  
      // if (filteredCartItems.length > 0) {
      //   setCartItems(filteredCartItems);
      // } else {
        
      // }

      fetchProductDetails();
    }, 200); // Delay execution slightly
  
    return () => clearTimeout(delayTimeout);
  }, [user, cart, productId]);
  

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${productId}`);
      const product = res.data;
      // console.log("Fetched Product Details:", product);

      setCartItems([
        {
          productId: product.id,
          name: product.title,
          price: product.price,
          image: product.thumbnail,
          category: product.category,
          quantity: 1,
        },
      ]);
      setIsDirectBuy(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      
      )
    );

  };

 
  

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address!");
      return;
    }

    if (!cartItems.length) {
      alert("No products selected for order.");
      return;
    }

    for (let item of cartItems) {
      if (item.category === "Clothing" && !selectedSize[item.productId]) {
        alert(`Please select a size for ${item.name}`);
        return;
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      userId: user._id,
      
      products: cartItems.map((item) => ({
        productName : item.name,
       
        
        productId: item.productId,
        quantity: item.quantity,
        size: item.category === "Clothing" ? selectedSize[item.productId] : null,
      })),
      
      totalAmount,
      shippingAddress: selectedAddress,
      paymentMethod: selectedPayment,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/place-order", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(placeOrder(res.data));

      await axios.delete(
        "http://localhost:5000/api/remove-from-cart", // Correct the endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId: cartItems.map((item) => item.productId) }, // Send productId as part of the request body
        }
      );
      

      // const { user, loading, error, token ,} = useSelector((state) => state.user);
    
      
      dispatch(fetchUser(user._id,token));
      // console.log("user cart for 1 ",user._id);
      
      dispatch(setUser({ user, token }));
      // console.log("user cart for 2 ",user); 

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>

      <div className="border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Delivery Address</h3>
        {selectedAddress ? (
          <p className="mt-2">
            <strong>{user?.name}</strong><br />
            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}, {selectedAddress.country}
          </p>
        ) : (
          <p className="text-red-500">No address found. Please add an address in your profile.</p>
        )}
      </div>

      <div className="mt-4 border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.productId} className="flex justify-between items-center mt-3">
            <div className="flex items-center space-x-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
              <div>
                <p className="font-medium">{item.name}</p>
                <div className="flex items-center space-x-2">
                  <label className="text-sm">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                    className="w-12 border rounded-md text-center"
                  />
                </div>

                {item.category === "Clothing" && (
                  <div className="mt-2">
                    <label className="text-sm font-semibold">Size:</label>
                    <select
                      className="ml-2 border p-1 rounded"
                      value={selectedSize[item.productId] || ""}
                      onChange={(e) =>
                        setSelectedSize({ ...selectedSize, [item.productId]: e.target.value })
                      }
                    >
                      <option value="">Select Size</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
        <hr className="my-3" />
        <p className="text-right font-semibold text-lg">
          Total: ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </p>
      </div>

      <div className="mt-4 border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Payment Method</h3>
        <div className="mt-2 flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={selectedPayment === "COD"}
              onChange={() => setSelectedPayment("COD")}
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="Online"
              checked={selectedPayment === "Online"}
              onChange={() => setSelectedPayment("Online")}
            />
            <span>Online Payment</span>
          </label>
        </div>
      </div>

      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-full text-lg" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
