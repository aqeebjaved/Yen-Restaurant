import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Get user ID from local storage
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Retrieve cart items from local storage
    const currentCartList = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]") || [];
    if (currentCartList.length > 0) {
      setCartItems(currentCartList);
      calculateTotal(currentCartList);
    }
  }, [userId]);

  const calculateTotal = (items) => {
    // Calculate total price of items in the cart
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const updateQuantity = (id, delta) => {
    // Update the quantity of items in the cart
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item
    );
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);
    setCartItems(filteredCart);
    calculateTotal(filteredCart);
    updateLocalStorage(filteredCart);
  };

  const updateLocalStorage = (updatedCart) => {
    // Update the cart in local storage
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    // Remove an item from the cart
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const handleOrderNow = () => {
    // Navigate to the payment page with cart items and total price
    navigate("/checkout/payment", { state: { cartItems, totalPrice, userId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="mb-8 text-3xl font-extrabold text-center text-pink-700 playfair tracking-wide drop-shadow">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-lg text-gray-500 py-12">Your cart is currently empty.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-white to-pink-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <img
                  className="object-cover w-24 h-24 rounded-xl border border-pink-200 shadow"
                  src={item.image}
                  alt={item.foodName}
                />
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xl font-bold text-gray-800 playfair">{item.foodName}</span>
                  <span className="text-base font-semibold text-pink-700">LKR {item.price}</span>
                  {item.tasteType && (
                    <span className="text-xs text-gray-600 mt-1">Taste: <span className="font-semibold text-gray-800">{item.tasteType}</span></span>
                  )}
                  {(item.vegToppings?.length > 0 || item.nonVegToppings?.length > 0) && (
                    <div className="mt-1 text-xs text-gray-600 flex flex-col gap-1">
                      {item.vegToppings?.length > 0 && (
                        <div className="flex items-center gap-1"><span className="font-semibold text-pink-700">Veg:</span> <span className="font-semibold text-gray-800">{item.vegToppings.join(", ")}</span></div>
                      )}
                      {item.nonVegToppings?.length > 0 && (
                        <div className="flex items-center gap-1"><span className="font-semibold text-blue-700">Non-Veg:</span> <span className="font-semibold text-gray-800">{item.nonVegToppings.join(", ")}</span></div>
                      )}
                    </div>
                  )}
                  {item.userComment && (
                    <div className="mt-1 text-xs text-gray-600 italic">Comment: <span className="font-semibold text-gray-800">{item.userComment}</span></div>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 w-fit font-medium text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 1}
                      className="px-2 py-1 bg-pink-200 text-pink-800 rounded hover:bg-pink-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-pink-200 text-pink-800 rounded hover:bg-pink-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-4">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-2xl font-extrabold text-pink-700">LKR {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleOrderNow} 
                className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
              >
                Order Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
