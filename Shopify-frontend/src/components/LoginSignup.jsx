import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice"; // Import action
import { useNavigate } from "react-router-dom";


const LoginSignup = () => {
  const [method, setMethod] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (method === "login") {
        const res = await axios.post("http://localhost:5000/auth/login", {
          email: formData.email,
          password: formData.password,
        });
  
        const { token, user } = res.data; // Ensure backend returns { user, token }
  
        // localStorage.setItem("token", token);
        dispatch(setUser({ user, token }));

        // console.log("Redux State after dispatch:", user); // ✅ Check Redux State
         // 🔹 Update Redux Store
        alert("Login successful!");
        navigate("/");
        
      } else {
        await axios.post("http://localhost:5000/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
        });
        alert("Signup successful! Please login.");
        setMethod("login");
      }
    } catch (error) {
      console.error("Error:", error); 
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };
  

  return (
    <div className="bg-gray-200 h-full flex justify-center  ">
      <div className={`w-full sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-1/2 h-full bg-white shadow-lg rounded-lg overflow-hidden ${method=='signup'? "mt-10":"mt-20 mb-80"}`} >
        <div className="grid grid-cols-2">
          <div className="bg-blue-500 text-white flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold">
              {method === "login" ? "Login" : "Looks like you're new here!"}
            </h2>
            <p className="mt-4 text-gray-200">
              {method === "login"
                ? "Get access to your Orders, Wishlist, and Recommendations."
                : "Sign up with your mobile number to get started."}
            </p>
          </div>
          <div className="p-10"> {/* Increased padding for more space */}
            <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space between elements */}
              {method === "signup" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full border-b py-3 focus:outline-none"  
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Mobile Number"
                    className="w-full border-b py-3 focus:outline-none"  
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="w-full border-b py-3 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full border-b py-3 focus:outline-none"  
                value={formData.password}
                onChange={handleChange}
                required
              />
              {method === "signup" && (
                <div className="grid grid-cols-2 gap-6"> 
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    className="border-b py-3 focus:outline-none"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="border-b py-3 focus:outline-none"  
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="border-b py-3 focus:outline-none" 
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    className="border-b py-3 focus:outline-none" 
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="border-b py-3 focus:outline-none" 
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3 rounded"  
              >
                {method === "login" ? "Login" : "Signup"}
              </button>
            </form>
            <div className="text-center mt-6"> {/* Increased margin */}
              {method === "login" ? (
                <p className="text-gray-600">
                  New to Shopify? {" "}
                  <span
                    onClick={() => setMethod("signup")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Create an account
                  </span>
                </p>
              ) : (
                <p className="text-gray-600">
                  Already have an account? {" "}
                  <span
                    onClick={() => setMethod("login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Log in
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
