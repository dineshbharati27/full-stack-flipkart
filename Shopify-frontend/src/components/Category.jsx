import { useEffect, useState, useRef } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slider1 from "../assets/images/slider1.webp";
import slider2 from "../assets/images/slider2.webp";
import slider3 from "../assets/images/slider3.webp";
import slider4 from "../assets/images/slider4.webp";
import slider5 from "../assets/images/slider5.webp";
import TrendingProducts from "./TrendingProducts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedProductId } from "../slices/productSlice";

const images = [slider1, slider2, slider3, slider4, slider5];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/category-list`);
        const allCategories = await res.json();
        const selectedCategories = allCategories.slice(0, 9);

        const categoriesWithImages = await Promise.all(
          selectedCategories.map(async (category) => {
            const categoryRes = await fetch(`https://dummyjson.com/products/category/${category}`);
            const categoryData = await categoryRes.json();
            return {
              name: category,
              thumbnail: categoryData.products[0]?.thumbnail || "",
            };
          })
        );

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle category expand/collapse
  const handleCategoryExpand = async (categoryName) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryName);

    if (!categoryProducts[categoryName]) {
      try {
        const res = await fetch(`https://dummyjson.com/products/category/${categoryName}`);
        const data = await res.json();
        setCategoryProducts((prev) => ({
          ...prev,
          [categoryName]: data.products || [],
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpandedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProductSelected = (productId) => {
    dispatch(setSelectedProductId(productId));
    if (productId) {
      navigate(`/product`);
    }
  };

  return (
    <>
      <div className="bg-gray-100 pt-4">
        <div className="flex justify-evenly items-center bg-white mx-4">
          {categories.map((cat, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col bg-white justify-center items-center h-32 w-32 p-0">
                <div className="p-0">
                  <img src={cat.thumbnail} alt={cat.name} width={90} height={70} />
                </div>
                <div className="flex justify-center items-center gap-1.5 pb-2">
                  <h4>{cat.name}</h4>
                  <div onClick={() => handleCategoryExpand(cat.name)}>
                    <FaAngleDown />
                  </div>
                </div>
              </div>
              {expandedCategory === cat.name && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-44 bg-white shadow-md rounded-md z-50"
                >
                  {categoryProducts[cat.name] ? (
                    categoryProducts[cat.name].map((product) => (
                      <div
                        key={product.id}
                        className="p-2 text-sm hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleProductSelected(product.id)}
                      >
                        {product.title}
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-sm">Loading products...</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Slider */}
        <div className="mt-4 mx-4 overflow-hidden flex justify-center items-center bg-white relative">
          <div className="w-full flex flex-col justify-center items-center overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="h-64 w-auto max-w-full object-cover rounded-lg transition-opacity duration-500"
            />
            <div className="my-2 bottom-2 w-full flex justify-center items-center gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-black" : "bg-gray-500"}`}
                />
              ))}
            </div>
          </div>

          {/* Left Navigator */}
          <button
            onClick={prevSlide}
            className="absolute left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
          >
            <ChevronLeft />
          </button>

          {/* Right Navigator */}
          <button
            onClick={nextSlide}
            className="absolute right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <TrendingProducts />
    </>
  );
};

export default Category;
