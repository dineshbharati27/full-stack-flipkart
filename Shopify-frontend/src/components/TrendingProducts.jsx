import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart } from "react-icons/fa";
// import { toggleWishlist } from "../services/wishListServic";
import { setUser } from "../slices/userSlice";
import { setSelectedProductId } from "../slices/productSlice";
import { useNavigate } from "react-router-dom"; // Import wishlist service
import { toggleWishlist } from "../services/wishListServic";
import Footer from "./Footer";

const TrendingProducts = () => {
  const [categoryProducts, setCategoryProducts] = useState([]); // State to store categories and products
  const user = useSelector((state) => state.user);
  // console.log("user store",user.token);
   // Get user from Redux
  const dispatch = useDispatch(); // Dispatch for updating Redux state
 const navigate = useNavigate();
  const handleProductSelected = (productId) => {
    dispatch(setSelectedProductId(productId));
          if(productId){ // Store selected product ID in Redux
          navigate(`/product`);
    }}
  // Fetch trending products from dummy JSON API
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const categoryRes = await fetch("https://dummyjson.com/products/category-list");
        const categories = (await categoryRes.json()).slice(0, 8); // Limit to 8 categories
        let allCategories = [];

        // Fetch products for each category
        for (const category of categories) {
          const productsRes = await fetch(`https://dummyjson.com/products/category/${category}?limit=5`);
          const productsData = await productsRes.json();
          allCategories = [...allCategories, { name: category, products: productsData.products }];
        }

        setCategoryProducts(allCategories); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
  }, []); // Empty dependency array to run once on component mount

  // Handle wishlist toggle (add/remove)
  const [localWishlist, setLocalWishlist] = useState(user?.wishlist || []);

  const handleWishlistToggle = (productId) => {
    // Optimistically update the wishlist color (local state)
    const updatedWishlist = localWishlist.includes(productId)
      ? localWishlist.filter((id) => id !== productId) // Remove from wishlist
      : [...localWishlist, productId]; // Add to wishlist

    setLocalWishlist(updatedWishlist); // Update local state

    // Dispatch the updated wishlist to Redux
    dispatch(setUser({ user: { ...user, wishlist: updatedWishlist }, token: user?.token }));

    // Call the toggleWishlist function to update the backend
    toggleWishlist(productId, user?.token, (updatedUser) => {
      // Sync Redux with the server response
      dispatch(setUser({ user: updatedUser, token: user?.token }));
    });


   


 
 
    


  };

  

  // Check if categoryProducts is defined and is an array
  const safeCategoryProducts = Array.isArray(categoryProducts) ? categoryProducts : [];

  return (
    <>
    <div className="bg-gray-100 py-2">
      <div className="bg-white pt-4 px-6 mx-4 my-4">
        {safeCategoryProducts.length > 0 ? (
          safeCategoryProducts.map((category, index) => (
            <div key={category.name} className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 text-left capitalize">Trending {category.name}</h2>
              <div className="flex overflow-x-auto space-x-6 pb-3 scrollbar-hide">
                {category.products.map((product) => (
                  <div key={product.id} className="w-68 flex flex-col items-center relative"  >
                    <img src={product.thumbnail} alt={product.title} className="h-32 w-32 object-cover" onClick={() => handleProductSelected(product.id)} />
                    <div className="text-gray-700 text-center mt-2 text-sm font-medium">{product.title}</div>
                    <div className="text-sm font-semibold">Up to {Math.floor(Math.random() * 50) + 10}% Off</div>

                    {/* Heart Icon for Wishlist */}
                    { user && user.user && user.user.wishlist ? (
  <FaHeart
    className={`absolute top-2 right-2 cursor-pointer text-xl ${
      user.user.wishlist.includes(product.id) ? "text-red-500" : "text-gray-300"
    }`}
    onClick={() => handleWishlistToggle(product.id)}
  />
) : null }
 

                  </div>
                ))}
              </div>
              {index !== safeCategoryProducts.length - 1 && <hr className="border-gray-300 my-4" />}
            </div>
          ))
        ) : (
          <p className="text-center text-lg font-semibold">Loading...</p>
        )}
      </div>
    </div>
     <Footer/>
     </>
  );
};

export default TrendingProducts;
