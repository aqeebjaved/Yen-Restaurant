import React, { useState, useEffect, useRef } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function FoodCategoryForm() {
  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    category: "Breakfast",
    price: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [vegToppings, setVegToppings] = useState([""]);
  const [nonVegToppings, setNonVegToppings] = useState([""]);

  const filePickerRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vegToppings" || name === "nonVegToppings") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((t) => t.trim()).filter(Boolean),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploading(true);
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Error uploading image. Please try again.");
        setImageUploadProgress(null);
        setImageUploading(false);

        Toastify({
          text: "Error uploading image!",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          duration: 3000,
          gravity: "top",
          position: "right",
        }).showToast();
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, image: downloadURL }));
        setImageUploading(false);

        Toastify({
          text: "Image uploaded successfully!",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          duration: 3000,
          gravity: "top",
          position: "right",
        }).showToast();
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUploading) {
      alert("Please wait until the image is uploaded.");
      return;
    }

    // Prepare payload with correct keys for toppings
    const payload = {
      ...formData,
      'Veg Toppings': vegToppings.filter((t) => t.trim() !== ""),
      'Non Veg Toppings': nonVegToppings.filter((t) => t.trim() !== ""),
    };
    console.log('Submitting payload:', payload);

    try {
      const response = await fetch("/api/foods/createFood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies (JWT)
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Toastify({
          text: "Food item created successfully!",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          duration: 3000,
          gravity: "top",
          position: "right",
        }).showToast();

        setFormData({
          foodName: "",
          description: "",
          category: "Breakfast",
          price: "",
          image: "",
        });
        setImageFile(null);
        setImageUploadProgress(null);
        setVegToppings([""]);
        setNonVegToppings([""]);
      } else {
        Toastify({
          text: "Failed to create food item!",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          duration: 3000,
          gravity: "top",
          position: "right",
        }).showToast();
      }
    } catch (error) {
      console.error("Error creating food item:", error);
      Toastify({
        text: "Error occurred while creating food item!",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
    }
  };

  const handleToppingChange = (setter, toppings, idx, value) => {
    const updated = [...toppings];
    updated[idx] = value;
    setter(updated);
  };
  const handleAddTopping = (setter, toppings) => {
    setter([...toppings, ""]);
  };
  const handleRemoveTopping = (setter, toppings, idx) => {
    if (toppings.length > 1) {
      setter(toppings.filter((_, i) => i !== idx));
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      'Veg Toppings': vegToppings.filter((t) => t.trim() !== ""),
      'Non Veg Toppings': nonVegToppings.filter((t) => t.trim() !== ""),
    }));
  }, [vegToppings, nonVegToppings]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
      <div className="w-full max-w-4xl p-10 bg-white rounded-2xl shadow-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Add New Food Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Food Name
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="Enter food name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Shorties">Shorties</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Veg Toppings
              </label>
              {vegToppings.map((topping, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={topping}
                    onChange={e => handleToppingChange(setVegToppings, vegToppings, idx, e.target.value)}
                    placeholder="Veg topping"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button type="button" onClick={() => handleRemoveTopping(setVegToppings, vegToppings, idx)} className="ml-2 px-2 py-1 bg-red-200 rounded">-</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddTopping(setVegToppings, vegToppings)} className="px-2 py-1 bg-green-200 rounded">+ Add Veg Topping</button>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Non-Veg Toppings
              </label>
              {nonVegToppings.map((topping, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={topping}
                    onChange={e => handleToppingChange(setNonVegToppings, nonVegToppings, idx, e.target.value)}
                    placeholder="Non-veg topping"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button type="button" onClick={() => handleRemoveTopping(setNonVegToppings, nonVegToppings, idx)} className="ml-2 px-2 py-1 bg-red-200 rounded">-</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddTopping(setNonVegToppings, nonVegToppings)} className="px-2 py-1 bg-red-200 rounded">+ Add Non-Veg Topping</button>
            </div>
          </div>

          {imageUploadProgress && (
            <div className="flex justify-center">
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar
                  value={imageUploadProgress || 0}
                  text={`${imageUploadProgress}%`}
                  strokeWidth={5}
                />
              </div>
            </div>
          )}
          {imageUploadError && (
            <p className="text-center text-red-600">{imageUploadError}</p>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 text-white transition duration-300 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Create Food Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}