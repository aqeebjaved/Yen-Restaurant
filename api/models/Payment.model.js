// payment model
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      foodName: String,
      quantity: Number,
      price: Number,
      tasteType: String, // Spicy, Salt, Mixed, etc.
      vegToppings: [String],
      nonVegToppings: [String],
      userComment: String,
    },
  ],
  totalPrice: Number,
  paymentInfo: {
    cardType: String,  // Add cardType to store selected card type
    cardName: String,
    cardNumber: String,
    expirationDate: String,
    securityCode: String,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false, // Payments are incomplete by default
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
