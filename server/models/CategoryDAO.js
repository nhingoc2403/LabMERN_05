const mongoose = require('mongoose');
const Models = require('./Models');

const CategoryDAO = {
  async selectAll() {
    return await Models.Category.find({});
  },

  async insert(category) {
    if (!category || !category.name) {
      throw new Error('Category object is undefined or missing name');
    }

    category._id = new mongoose.Types.ObjectId(); // Assign a unique ID
    return await Models.Category.create(category);
  },
  async update(category) {
    const newvalues = { name: category.name };
    const result = await Models.Category.findByIdAndUpdate(
      category._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    try {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error('Invalid Category ID');
      }
      
      const result = await Models.Category.findByIdAndDelete(_id);
      return result;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  async selectByID(_id) {
    try {
      console.log("Finding category with ID:", _id);
      const category = await Models.Category.findById(_id).exec();
      console.log("Category found:", category);
      return category;
    } catch (error) {
      console.error("Error in selectByID:", error);
      return null;
    }
  },
  async selectByID(_id){
    const category = await Models.Category.findById(_id).exec();
    return category;
  }
};


module.exports = CategoryDAO;
