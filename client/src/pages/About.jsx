import React from 'react';
// Import FontAwesome icons
import { FaUtensils, FaLeaf, FaHome, FaUsers } from 'react-icons/fa';

export default function About() {
  return (
    <>

    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100">
      <div className="w-full max-w-4xl p-10 space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-pink-700 playfair tracking-wide drop-shadow mb-4">About Us</h2>
        <p className="text-lg text-center text-gray-700 mb-6">
          Welcome to <span className="font-bold text-pink-600">YEN Restaurant</span>, where passion for flavor meets a love for the finest ingredients. Established with the goal of offering a memorable dining experience, our restaurant combines exquisite cuisine, a warm ambiance, and excellent service.
        </p>
        <div className="space-y-8">
          {/* Our Story Section */}
          <div className="flex items-center space-x-4">
            <FaUtensils className="text-3xl text-pink-600" />
            <h3 className="text-2xl font-bold text-gray-900 playfair">Our Story</h3>
          </div>
          <p className="text-gray-600 text-base">
            From humble beginnings, <span className="font-bold text-pink-600">YEN Restaurant</span> was born out of a deep love for food and a desire to create a space where people could come together to enjoy mouth-watering dishes. Our chefs, with their innovative approach to traditional recipes, have crafted a menu that tantalizes the taste buds and warms the soul.
          </p>
          {/* Our Philosophy Section */}
          <div className="flex items-center space-x-4">
            <FaLeaf className="text-3xl text-green-500" />
            <h3 className="text-2xl font-bold text-gray-900 playfair">Our Philosophy</h3>
          </div>
          <p className="text-gray-600 text-base">
            We believe that good food is the heart of every great gathering. That's why we source only the freshest, high-quality ingredients and prepare each dish with love and attention to detail. Our commitment is to create a unique and unforgettable dining experience for each and every one of our guests.
          </p>
          {/* Our Ambiance Section */}
          <div className="flex items-center space-x-4">
            <FaHome className="text-3xl text-yellow-500" />
            <h3 className="text-2xl font-bold text-gray-900 playfair">Our Ambiance</h3>
          </div>
          <p className="text-gray-600 text-base">
            Whether you’re enjoying a romantic dinner, a family meal, or a special celebration, our cozy and welcoming atmosphere sets the perfect backdrop for every occasion. We’ve created a space that feels like home, with a touch of elegance and warmth, making it the ideal setting for a wonderful dining experience.
          </p>
          {/* Join Us Section */}
          <div className="flex items-center space-x-4">
            <FaUsers className="text-3xl text-indigo-500" />
            <h3 className="text-2xl font-bold text-gray-900 playfair">Join Us</h3>
          </div>
          <p className="text-gray-600 text-base">
            At <span className="font-bold text-pink-600">YEN Restaurant</span>, we don’t just serve food – we create experiences. Join us for a delightful meal and allow us to treat you to our signature hospitality and flavorful dishes that will keep you coming back for more.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
