import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const user = useSelector((state) => state.user.user); // Get user details from Redux store
  const navigate = useNavigate();
  // Local state for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login")
      setError("User data not found!");
      setLoading(false);
      return;
    }

    // You can perform additional checks or API calls here if needed

    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Personal Information</h3>
        <div className="mt-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <div className="mt-4 border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Address</h3>
        {user.address ? (
          <div className="mt-4">
            <p><strong>Street:</strong> {user.address.street}</p>
            <p><strong>City:</strong> {user.address.city}</p>
            <p><strong>State:</strong> {user.address.state}</p>
            <p><strong>ZIP Code:</strong> {user.address.zip}</p>
            <p><strong>Country:</strong> {user.address.country}</p>
          </div>
        ) : (
          <p className="text-red-500">No address found. Please add an address in your profile.</p>
        )}
      </div>

      <div className="mt-4 border p-4 bg-white shadow-md rounded-md">
        <h3 className="font-semibold border-b pb-2">Additional Information</h3>
        <div className="mt-4">
          <p><strong>Phone Number:</strong> {user.phone || "Not provided"}</p>
          <p><strong>Date of Birth:</strong> {user.dob || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
