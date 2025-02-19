import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(null); // Track canceling state
  const [productThumbnails, setProductThumbnails] = useState({}); // Store thumbnails from external API
 const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Fetch orders and product thumbnails
  useEffect(() => {
    if(user && user.user){
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user-orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Sort orders to move cancelled orders to the bottom
        const sortedOrders = res.data.sort((a, b) => {
          if (a.orderStatus === "Cancelled" && b.orderStatus !== "Cancelled") {
            return 1;
          } else if (a.orderStatus !== "Cancelled" && b.orderStatus === "Cancelled") {
            return -1;
          }
          return 0; // Keep other orders in the original order
        });

        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders" ,err);
       
        
        setLoading(false);
      }
    };

    const fetchProductThumbnail = async (productId) => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const productData = await response.json();
        if (productData && productData.thumbnail) {
          setProductThumbnails((prev) => ({
            ...prev,
            [productId]: productData.thumbnail, // Save thumbnail by product ID
          }));
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };

    if (user) {
      fetchOrders();
    }

    // Fetch thumbnails for each product in the orders
    const fetchAllThumbnails = async () => {
      orders.forEach((order) => {
        order.products.forEach((item) => {
          const productId = item.productId;
          if (!productThumbnails[productId]) {
            fetchProductThumbnail(productId); // Fetch thumbnail if not already fetched
          }
        });
      });
    };

    fetchAllThumbnails();
  }else{
    navigate('/login');
  }

    
  }, [orders]);

  const handleCancelOrder = async (orderId) => {
    setCanceling(orderId); // Indicate which order is being canceled
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cancel-order",
        { orderId, userId: user.user._id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // Update order status in UI and sort orders
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        );
        return updatedOrders.sort((a, b) => {
          // Place cancelled orders at the bottom
          if (a.orderStatus === "Cancelled" && b.orderStatus !== "Cancelled") {
            return 1;
          } else if (a.orderStatus !== "Cancelled" && b.orderStatus === "Cancelled") {
            return -1;
          }
          return 0; // Keep other orders in the original order
        });
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    } finally {
      setCanceling(null); // Reset canceling state
    }
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  if (!orders.length) return <div className="text-center">Your order history is empty.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border-b pb-4">
           
            <p className="text-gray-600">Status: {order.orderStatus}</p>
            <p className="text-gray-600">Total Amount: ₹{order.totalAmount}</p>
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Products</h4>
              {order.products.map((item, index) => {
                const externalThumbnail = productThumbnails[item.productId];
                
                return (
                  <div key={index} className="flex items-center space-x-4 mt-2">
                    <img
                      src={externalThumbnail || item.productId.thumbnail}
                      alt={item.productId.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p>{item.productName}</p>
                      <p>{item.productId.title}</p>
                      <p>Quantity: {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <p className="text-gray-600">Shipping Address:</p>
              <ul className="text-gray-600">
                <li>{order.shippingAddress.street}</li>
                <li>{order.shippingAddress.city}</li>
                <li>{order.shippingAddress.state}</li>
                <li>{order.shippingAddress.zip}</li>
                <li>{order.shippingAddress.country}</li>
                <li>{order.products.productName}</li>
              </ul>
              <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
              <p className="text-gray-600">
                Order Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            {/* Cancel Order Button */}
            {order.orderStatus !== "Cancelled" && (
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg"
                onClick={() => handleCancelOrder(order._id)}
                disabled={canceling === order._id}
              >
                {canceling === order._id ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
