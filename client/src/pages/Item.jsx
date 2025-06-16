import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function Item() {
  const [foodItems, setFoodItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();

  // Fetch all food items based on search
  const fetchFoodItems = async () => {
    try {
      const response = await fetch(`/api/foods/getAllFoods?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }

      const data = await response.json();
      if (data.foodItems) {
        setFoodItems(data.foodItems);
        setError(null);
      } else {
        setFoodItems([]); // Set empty if no items found
        setError("No items found");
      }
    } catch (error) {
      setError(error.message);
      setFoodItems([]); // Handle error by resetting the foodItems
    }
  };

  // Update cart count
  const updateCartCount = () => {
    const userId = localStorage.getItem("userId");
    const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
    setCartCount(userCart.length);
  };

  // Add food item to the cart
  const addToCart = (item) => {
    const userId = localStorage.getItem("userId");
    const cartKey = `cart_${userId}`;
    const currentCartList = JSON.parse(localStorage.getItem(cartKey) || "[]");

    if (!currentCartList.some((cartItem) => cartItem.id === item._id)) {
      currentCartList.push({
        id: item._id,
        quantity: 1,
        price: item.price,
        foodName: item.foodName,
        image: item.image,
        tasteType: item.tasteType,
        userComment: item.userComment,
        vegToppings: item.vegToppings || [],
        nonVegToppings: item.nonVegToppings || [],
      });
    } else {
      currentCartList.forEach((cartItem) => {
        if (cartItem.id === item._id) {
          cartItem.quantity += 1;
          cartItem.tasteType = item.tasteType;
          cartItem.userComment = item.userComment;
          cartItem.vegToppings = item.vegToppings || [];
          cartItem.nonVegToppings = item.nonVegToppings || [];
        }
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(currentCartList));
    setCartCount(currentCartList.length);
    showToast("Item added to cart!");
  };

  // Handle "Buy Now" button click
  const handleBuyNow = (item) => {
    addToCart(item);
    navigate(`/shoppingCart`);
  };

  // Show toast notification
  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #4caf50, #81c784)",
    }).showToast();
  };

  useEffect(() => {
    fetchFoodItems();
    updateCartCount();
  }, [searchTerm]); // Re-fetch food items on search term change

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user ? JSON.parse(user).currentUser : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 py-8">
      {/* Top bar with "Add Your Item", Cart and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white shadow rounded-xl max-w-5xl mx-auto mb-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide mb-4 md:mb-0 playfair">Menu</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search Food..."
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 w-full md:w-64 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="relative flex items-center">
            <Link to={`/shoppingCart`}>
              <span className="text-3xl text-pink-700 hover:text-pink-900 transition">
                <MdOutlineShoppingCart />
              </span>
            </Link>
            <div className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-pink-600 rounded-full -top-2 -right-2 border-2 border-white">
              <p>{cartCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center">
        <div className="max-w-7xl w-full px-2">
          {error ? (
            <p className="text-red-600 dark:text-red-400 text-center text-lg font-semibold py-8">{error}</p>
          ) : foodItems.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center text-lg font-semibold py-8">No items available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {foodItems.map((item) => (
                <ItemCard key={item._id} item={item} addToCart={addToCart} handleBuyNow={handleBuyNow} currentUser={currentUser} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add ItemCard component below:
function ItemCard({ item, addToCart, handleBuyNow, currentUser }) {
  const [tasteType, setTasteType] = useState('Spicy');
  const [userComment, setUserComment] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [vegToppings, setVegToppings] = useState([]);
  const [nonVegToppings, setNonVegToppings] = useState([]);

  const vegOptions = ["Paneer", "Onion", "Tomato", "Capsicum", "Corn"];
  const nonVegOptions = ["Chicken", "Egg", "Fish", "Prawn"];

  const handleToppingChange = (type, topping) => {
    if (type === 'veg') {
      setVegToppings(prev => prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]);
    } else {
      setNonVegToppings(prev => prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...item, tasteType, userComment, vegToppings, nonVegToppings });
  };
  const handleBuy = () => {
    handleBuyNow({ ...item, tasteType, userComment, vegToppings, nonVegToppings });
  };

  return (
    <div className="flex flex-col bg-white shadow-xl rounded-2xl w-full max-w-xs mx-auto border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="relative h-44 w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <img
          src={item.image}
          alt={item.foodName}
          className="object-cover h-full w-full rounded-t-2xl transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-lg text-gray-900 truncate playfair" title={item.foodName}>{item.foodName}</span>
          <span className="font-bold text-pink-600 text-base">LKR {item.price}</span>
        </div>
        <p className="text-xs text-gray-600 mb-2 min-h-[36px] italic">{item.description}</p>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Taste</label>
          <select
            value={tasteType}
            onChange={e => setTasteType(e.target.value)}
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs mb-1 bg-white"
          >
            <option value="Spicy">Spicy</option>
            <option value="Salt">Salt</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Comments</label>
          <input
            type="text"
            value={userComment}
            onChange={e => setUserComment(e.target.value)}
            placeholder="Add your comments..."
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs mb-1 bg-white"
          />
        </div>
        <button
          type="button"
          className="mt-1 px-2 py-1 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded text-xs font-semibold hover:from-yellow-300 hover:to-yellow-500 transition w-fit self-end shadow-sm border border-yellow-300"
          onClick={() => setShowCustomization(v => !v)}
        >
          {showCustomization ? (
            <span className="flex items-center gap-1"><svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> Hide Customization</span>
          ) : (
            <span className="flex items-center gap-1"><svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Add Customization</span>
          )}
        </button>
        {showCustomization && (
          <div className="mt-3 border rounded-xl p-3 bg-gradient-to-br from-white to-yellow-50 shadow-inner">
            <div className="mb-2">
              <span className="font-semibold text-xs text-pink-700">Veg Toppings</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {vegOptions.map(opt => (
                  <label key={opt} className="flex items-center text-xs bg-pink-50 px-2 py-1 rounded-lg cursor-pointer border border-pink-200 hover:bg-pink-100 transition">
                    <input
                      type="checkbox"
                      checked={vegToppings.includes(opt)}
                      onChange={() => handleToppingChange('veg', opt)}
                      className="mr-1 accent-pink-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-xs text-blue-700">Non-Veg Toppings</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {nonVegOptions.map(opt => (
                  <label key={opt} className="flex items-center text-xs bg-blue-50 px-2 py-1 rounded-lg cursor-pointer border border-blue-200 hover:bg-blue-100 transition">
                    <input
                      type="checkbox"
                      checked={nonVegToppings.includes(opt)}
                      onChange={() => handleToppingChange('nonveg', opt)}
                      className="mr-1 accent-blue-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {currentUser?._id && (
          <div className="flex justify-between gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-3 py-2 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg hover:from-green-600 hover:to-green-800 text-xs transition-all duration-200 shadow"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuy}
              className="flex-1 px-3 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-800 text-xs transition-all duration-200 shadow"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
