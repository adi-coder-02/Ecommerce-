const Category = require('../models/category');
const Product = require('../models/product');
const {errorHandler} = require("../helpers/dbErrorHandler"); 
const { read } = require('../controllers/category');


exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id);  // Use await instead of exec()
        if (!category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Category not found'
        });
    }
};


exports.create = async (req, res) => {
    try {
        const category = new Category(req.body);
        const data = await category.save(); // Use await instead of a callback
        res.json({ data });
    } catch (err) {
        res.status(400).json({
            error: errorHandler(err) // Handle errors appropriately
        });
    }
};

exports.read = (req, res) => {
    const category = req.category;
    if (!category) {
        return res.status(400).json({
            error: "Category not found"
        });
    }
    res.json(category);  // Send back the category data
};

exports.update = async (req, res) => {
    console.log('req.body', req.body);
    console.log('category update param', req.params.categoryId);

    try {
        const category = req.category;

        if (!category) {
            return res.status(400).json({
                error: 'Category not found'
            });
        }

        // Update the category's name
        category.name = req.body.name;

        // Save the updated category
        const updatedCategory = await category.save(); // Use async/await
        res.json(updatedCategory);
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const category = req.category;

        if (!category) {
            return res.status(400).json({ error: "Category not found in request." });
        }

        console.log("Category to delete:", category);

        const associatedProducts = await Product.find({ category }).exec();
        console.log("Associated products:", associatedProducts);

        if (associatedProducts.length > 0) {
            return res.status(400).json({
                error: `Cannot delete category '${category.name}' as it has ${associatedProducts.length} associated products.`,
            });
        }

        const deletedCategory = await category.deleteOne(); // Use deleteOne for newer Mongoose APIs
        console.log("Deleted category:", deletedCategory);

        res.json({
            message: `Category '${deletedCategory.name}' deleted successfully.`,
        });
    } catch (err) {
        console.error("Error while deleting category:", err);

        // Handle errors more gracefully
        res.status(500).json({
            error: errorHandler(err) || "An unexpected error occurred while deleting the category.",
        });
    }
};



exports.list = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            error: errorHandler(err)
        });
    }
};


