import FoodItem from '../models/foodCategory.model.js';
import { errorHandler } from '../utils/error.js';

// Function to find food item by ID
export const findFoodById = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    
    const foodItem = await FoodItem.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json(foodItem);
  } catch (error) {
    next(error);
  }
};
    
// Create a new food category
export const createFoodItem = async (req, res, next) => {
  try {
    if (req.user.role !== "Manager" && req.user.role !== "Employee") {
      return next(errorHandler(403, 'You are not allowed to create a food category'));
    }

    const { foodName, description, category, price, image } = req.body;

    // Accept both camelCase and spaced keys for toppings
    const vegToppings = req.body["Veg Toppings"] || req.body.vegToppings || [];
    const nonVegToppings = req.body["Non Veg Toppings"] || req.body.nonVegToppings || [];

    if (!foodName || foodName.trim() === '') {
      return next(new Error('Food name is required'));
    }

    const newFoodItem = new FoodItem({
      foodName,
      description,
      category,
      price,
      image,
      'Veg Toppings': vegToppings,
      'Non Veg Toppings': nonVegToppings,
    });

    const savedItem = await newFoodItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
};


// Delete a food category by ID
export const deleteFoodItem = async (req, res, next) => {
  try {
    // if (!req.user.isAdmin) {
      if (req.user.role !== "Manager" && req.user.role !== "Employee") {
      return next(errorHandler(403, 'You are not allowed to delete this food category'));
    }

    await FoodItem.findByIdAndDelete(req.params.itemId);
    res.status(200).json({ message: 'Food category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update a food category by ID
export const updateFoodItem = async (req, res, next) => {
  try {
    // if (!req.user.isAdmin) {
      if (req.user.role !== "Manager" && req.user.role !== "Employee") {

      return next(errorHandler(403, 'You are not allowed to update this food category'));
    }

    const { foodName, description, category, price, image } = req.body;

    const vegToppingsUpdate = req.body["Veg Toppings"] || req.body.vegToppings || [];
    const nonVegToppingsUpdate = req.body["Non Veg Toppings"] || req.body.nonVegToppings || [];

    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: {
          foodName,
          description,
          category,
          price,
          image,
          'Veg Toppings': vegToppingsUpdate,
          'Non Veg Toppings': nonVegToppingsUpdate,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};




// Get all food items or filter by search query
export const getFoodItem = async (req, res, next) => {
  try {
    const searchQuery = req.query.search || ""; // Get the search term from the query params
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex for searching
    const foodItems = await FoodItem.find({ foodName: regex });
    
    if (foodItems.length === 0) {
      return res.status(404).json({ message: 'No food items found' });
    }
    
    res.status(200).json({ foodItems });
  } catch (error) {
    next(error);
  }
};

