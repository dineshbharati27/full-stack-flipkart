import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { addToCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { setSelectedProductId } from "../slices/productSlice";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Import heart icons
import { toggleWishlist } from "../services/wishListServic"; // Backend API function

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productId = useSelector((state) => state.product?.selectedProductId);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.user) {
      navigate('/login');
      return;
    }

    if (!productId) return;

    fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        return fetch(`https://dummyjson.com/products/category/${data.category}`);
      })
      .then((res) => res.json())
      .then((relatedData) => setRelatedProducts(relatedData.products))
      .catch((error) => console.error("Error fetching data:", error));
  }, [productId, user, navigate]);

  const handleWishlistToggle = (productId) => {
    if (!user?.user) {
      navigate("/login");
      return;
    }

    const updatedWishlist = user.user.wishlist.includes(productId)
      ? user.user.wishlist.filter((id) => id !== productId)
      : [...user.user.wishlist, productId];

    // Optimistic update in Redux
    dispatch(setUser({ user: { ...user.user, wishlist: updatedWishlist }, token: user.token }));

    // Sync with backend
    toggleWishlist(productId, user.token, (updatedUser) => {
      dispatch(setUser({ user: updatedUser, token: user.token }));
    });
  };

  const handleAddToCart = async () => {
    if (!user || !user.user) {
      navigate('/login');
      return;
    }

    try {
      const updatedUser = await addToCart(product.id, user.token, user.user.cart);
      dispatch(setUser({ user: updatedUser, token: user.token }));
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("Failed to add product to cart.");
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/placeOrder/${productId}`);
  };

  if (!product) {
    return <div className="text-center text-xl p-5">Loading...</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex">
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex flex-row items-center">
            <div className="flex flex-col space-y-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg cursor-pointer border border-gray-300"
                />
              ))}
            </div>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-auto rounded-lg mt-2"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            {user ? (
              <>
                {Array.isArray(user?.user.cart) &&
                user.user.cart.find((item) => item.productId === product.id) ? (
                  <button className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed">
                    Already in Cart
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                )}
                <button
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={() => handleBuyNow(product.id)}
                >
                  Buy Now
                </button>
                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product.id)}
                  className="ml-4"
                >
                  {user.user.wishlist.includes(product.id) ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-500 text-2xl" />
                  )}
                </button>
              </>
            ) : (
              <p className="text-red-500 text-sm">
                Please log in to add items to the cart or buy now.
              </p>
            )}
          </div>
        </div>
  
        <div className="w-2/3 pl-6">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-sm mt-2">{product.description}</p>
          <p className="text-lg font-semibold text-green-600 mt-2">
            ${product.price} ({product.discountPercentage}% OFF)
          </p>
          <div className="flex items-center mt-2">
            Rating: {renderStars(Math.round(product.rating))}
          </div>
          <div className="mt-4">
           
          <div className="space-y-4 mt-4">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm">
                      <p className="font-semibold">{review.reviewerName}</p>
                      <div className="flex items-center space-x-1">
                        {/* Star Rating */}
                        {renderStars(Math.round(review.rating))}
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>

          </div>
        </div>
      </div>
  
      {/* Related Products */}
      <h2 className="text-xl font-semibold mt-6">Related Products</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {relatedProducts.map((related) => (
          <div key={related.id} className="border p-2 rounded-lg shadow-sm">
            <img
              src={related.thumbnail}
              alt={related.title}
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => dispatch(setSelectedProductId(related.id))}
            />
            <h3 className="text-sm font-semibold mt-2">{related.title}</h3>
            <p className="text-green-600 font-semibold">${related.price}</p>
            <p className="text-red-500 text-xs">{related.discountPercentage}% OFF</p>
            {/* Wishlist Button for Related Products */}
            <button
              onClick={() => handleWishlistToggle(related.id)}
              className="mt-2"
            >
              {user.user.wishlist.includes(related.id) ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-500 text-2xl" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default ProductPage;
