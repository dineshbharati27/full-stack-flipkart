import React, { useState, useEffect, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { BsCart3 } from "react-icons/bs";
import { TbBuildingStore } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { TiPlusOutline } from "react-icons/ti";
import { LuPackagePlus } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { GoGift } from "react-icons/go";
import { IoCardSharp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProductId } from '../slices/productSlice';
import { setUser } from '../slices/userSlice';


const Navbar = () => {
  const [loginDropDown, setLoginDropDown] = useState(false);
  const [wishlistDropDown, setWishlistDropDown] = useState(false); // Wishlist dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected index for keyboard navigation
  const dropdownRef = useRef(null); // Reference to dropdown for click outside detection
  const inputRef = useRef(null); // Reference to input for focusing
  const loginDropdownRef = useRef(null); // Reference to login dropdown for click outside detection
  const wishlistDropdownRef = useRef(null); // Reference to wishlist dropdown for click outside detection
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
        inputRef.current && !inputRef.current.contains(event.target)) || 
        (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) ||
        (wishlistDropdownRef.current && !wishlistDropdownRef.current.contains(event.target))
      ) {
        setSearchResults([]);
        setLoginDropDown(false);
        setWishlistDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(null); // Reset selected index when search changes

    if (e.target.value.trim()) {
      try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${e.target.value}`);
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (searchResults.length > 0) {
      if (e.key === 'ArrowDown' && selectedIndex < searchResults.length - 1) {
        setSelectedIndex(prevIndex => prevIndex + 1);
      } else if (e.key === 'ArrowUp' && selectedIndex > 0) {
        setSelectedIndex(prevIndex => prevIndex - 1);
      } else if (e.key === 'Enter' && selectedIndex !== null) {
        handleProductClick(searchResults[selectedIndex].id, searchResults[selectedIndex].title);
      }
    }
  };

  const dispatch = useDispatch(); // Dispatch for updating Redux state
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLoginDropDown = () => {
    setLoginDropDown(!loginDropDown);
    setWishlistDropDown(false); // Close wishlist dropdown if it's open
  };

  const handleWishlistDropDown = () => {
    setWishlistDropDown(!wishlistDropDown);
    setLoginDropDown(false); // Close login dropdown if it's open
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const showCart = () => {
    navigate('/cart');
  };

  const handleProductClick = (productId, productName) => {
    dispatch(setSelectedProductId(productId));
    if (productId) {
      navigate(`/product`);
    }
    setSearchResults([]); // Close dropdown after selection
  };

  return (
    <div className="flex justify-center items-center flex-wrap md:flex-nowrap sticky top-0 bg-white z-10">
      <div className='flex justify-evenly items-center w-full py-4 sm:flex-wrap md:flex-nowrap'>
        <div className='flex justify-center items-center w-full md:pl-16 md:gap-4'>
          <div id='logo' className='text-indigo-700 text-2xl font-bold'>
            Flipkart
          </div>
          <div className='flex items-center justify-center p-2 gap-2 bg-gray-200 rounded-md relative'>
            <CiSearch />
            <input 
              ref={inputRef}
              type="text" 
              name="searchbar" 
              id="searchbar" 
              className='md:w-2xl focus:outline-none focus:ring-0' 
              placeholder='Search for products, brands and more'
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Add keydown event for keyboard navigation
            />
            {searchQuery && searchResults.length > 0 && (
              <div ref={dropdownRef} className="absolute bg-white shadow-lg w-full mt-2 z-20 max-h-60 overflow-y-auto border border-gray-200 rounded-md top-full left-0">
                <ul>
                  {searchResults.map((product, index) => (
                    <li 
                      key={product.id} 
                      className={`p-2 hover:bg-gray-200 cursor-pointer ${selectedIndex === index ? 'bg-blue-100' : ''}`} 
                      onClick={() => handleProductClick(product.id, product.title)}
                    >
                      {product.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-evenly items-center w-full flex-wrap md:flex-nowrap'>
          <div id='home' className='rounded-md hover:bg-blue-500 hover:text-white'>
            <button className="flex justify-center items-center p-2 gap-2" onClick={handleHomeClick}>
              Home
            </button>
          </div>

          <div id='login'>
            <div className="relative">
              <button
                type="button"
                className={`rounded-md px-2 hover:bg-blue-500 hover:text-white  ${loginDropDown ? "bg-blue-500 text-white" : ""}`}
                onClick={handleLogin}
                
              >
                <div className="flex justify-center items-center p-2 gap-2">
                  <CgProfile /> {!user?"Login":user.name}
                  <span onClick={(e) => { e.stopPropagation(); handleLoginDropDown(); }}>
                    {loginDropDown ? <FaAngleDown /> : <FaAngleUp />}
                  </span>
                </div>
              </button>

              {loginDropDown && (
                <div ref={loginDropdownRef} className="scroll-container absolute right-0 mt-2 bg-white rounded shadow-lg w-[200px] max-h-[300px] overflow-y-auto z-10">
                  <ul className="p-2">
                    <li className="flex justify-between items-center p-2 border-b border-b-gray-400 whitespace-nowrap">
                      <span>New Customer ?</span>
                      <button type="button" className="text-blue-600 px-2 py-1 rounded" onClick={handleLogin}>
                        Signup
                      </button>
                    </li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1" onClick={() => navigate("/myprofile")}><CgProfile />My Profile</li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1"><TiPlusOutline />Flipkart Plus Zone</li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1" onClick={() => navigate("/orders")}><LuPackagePlus />Orders</li>
                    <li 
  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1" 
  onClick={() => {
    handleWishlistDropDown(); // Toggle wishlist dropdown
    navigate("/wishlist");    // Navigate to the wishlist page
  }}
>
  <FaRegHeart /> Wishlist
</li>
 <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1"><GoGift />Rewards</li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1"><IoCardSharp />Gift Cards</li>
                    <li
                className={`p-2 flex items-center justify-self-start gap-1 ${
                  !user ? "cursor-not-allowed text-gray-400" : "hover:bg-gray-200 cursor-pointer"
                }`}
                onClick={() => {
                  if (user) {
                    dispatch(setUser({}));
                  }
                }}
              >
               <IoIosLogOut />Log Out
              </li>
                    
                    {/* <li className="p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-self-start gap-1" onClick={()=>dispatch(setUser({}))}><IoCardSharp />Log Out</li> */}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div id='cart'>
            <button type="button" className='rounded-md hover:bg-blue-500 hover:text-white' onClick={showCart}>
              <div className='flex justify-center items-center p-2 gap-2'>
                <BsCart3 />
                Cart
              </div>
            </button>
          </div>

          <div id='becomeSeller' className='rounded-md hover:bg-blue-500 hover:text-white'>
            <div className='flex justify-center items-center p-2 gap-2'>
              <TbBuildingStore />
              Become seller
            </div>
          </div>
          
          <div>
            <BsThreeDotsVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
