const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  wishlist: [{ type: Number }], // Store product IDs from DummyJSON
  cart: [
    {
      productId: { type: Number, required: true },
     
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
