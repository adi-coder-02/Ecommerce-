const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({
                error: "Product not found",
            });
        }
        req.product = product;
        next();
    } catch (error) {
        console.error("Error finding product by ID:", error);
        return res.status(400).json({
            error: "An error occurred while fetching the product",
        });
    }
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log("Formidable parse error:", err);
          return res.status(400).json({ error: "Image could not be uploaded" });
        }
      
        console.log("Fields:", fields);
        console.log("Files:", files);
      
        const sanitizedFields = {};
        for (const key in fields) {
            sanitizedFields[key.trim()] = Array.isArray(fields[key]) 
                ? fields[key][0].trim() 
                : fields[key].trim();
        }

        const { name, description, price, quantity, shipping } = sanitizedFields;

      
        // Log missing fields if any
        if (!name || !description || !price || !quantity || !shipping) {
          console.log("Missing fields:");
          if (!name) console.log("name is missing");
          if (!description) console.log("description is missing");
          if (!price) console.log("price is missing");
          if (!quantity) console.log("quantity is missing");
          if (!shipping) console.log("shipping is missing");
      
          return res.status(400).json({ error: "All fields required" });
        }
        form.parse(req, (err, fields, files) => {
            if (err) return res.status(400).json({ error: "Form parse error" });
        
            // Flatten fields if they appear as arrays
            const sanitizedFields = {};
            for (const key in fields) {
                sanitizedFields[key.trim()] = Array.isArray(fields[key]) 
                  ? fields[key][0].trim() 
                  : fields[key].trim();
            }
        
            res.json({ fields: sanitizedFields, files });
        });
        

  
      let product = new Product(sanitizedFields);
  
      if (files.photo) {
        //console.log("FILES PHOTO: ", files.photo);
        //1kb = 1000
        //1mb = 1000000
  
        const photoFile = Array.isArray(files.photo)
          ? files.photo[0]
          : files.photo;
  
        if (photoFile.size > 1000000) {
          return res.status(400).json({
            error: "Image should be less than 1MB in size",
          });
        }
  
        try {
          product.photo.data = fs.readFileSync(photoFile.filepath);
          product.photo.contentType = photoFile.mimetype;
        } catch (error) {
          console.error("Error reading file:", error);
          return res.status(400).json({
            error: "Failed to process uploaded file",
          });
        }
      }
  
      try {
        const result = await product.save();
        res.json(result);
      } catch (error) {
        console.error("Error saving product:", error);
        res.status(400).json({
          error: errorHandler(error),
        });
      }
    });
  };

  exports.remove = async (req, res) => {
    try {
        const product = req.product;

        // Use deleteOne instead of remove
        const result = await product.deleteOne();
        res.json({
            message: "Product deleted successfully",
            result,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            error: "An error occurred while deleting the product",
        });
    }
};


exports.update = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Log parsed fields to inspect the values
        console.log("Parsed fields:", fields);

        const { name, description, price, quantity, shipping } = fields;

        const sanitizedFields = {
            name: (name && name[0]) || 'Default Name', // Handle name field properly
            description: (description && description[0]) || 'No description available',
            price: price && price[0] ? parseFloat(price[0]) : 0,
            quantity: quantity && quantity[0] ? parseInt(quantity[0]) : 0,
            shipping: shipping && shipping[0] ? shipping[0].trim() === 'true' : false,
        };

        // Find the product to update
        let product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(400).json({
                error: 'Product not found'
            });
        }

        // Update the product
        product = _.extend(product, sanitizedFields);

        // Check if photo is provided and its size
        if (files.photo) {
            const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
            if (photoFile.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                });
            }

            product.photo.data = fs.readFileSync(photoFile.filepath);
            product.photo.contentType = photoFile.mimetype;
        }

        // Save the updated product
        try {
            const updatedProduct = await product.save();  // Save using async/await
            res.json(updatedProduct);
        } catch (err) {
            return res.status(400).json({
                error: err.message || 'Failed to save product'
            });
        }
    });
};
    

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = async (req, res) => {
  // Validate query parameters and set default values
  let order = req.query.order && (req.query.order === 'asc' || req.query.order === 'desc') ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  // Validate limit
  if (isNaN(limit) || limit <= 0) limit = 6;  // Default to 6 if invalid limit

  // Validate sortBy (Add more valid fields to this list as needed)
  const validSortFields = ['name', 'price', '_id']; // Customize based on your model
  if (!validSortFields.includes(sortBy)) sortBy = '_id';

  try {
      // Query the database with async/await
      const products = await Product.find()
          .select('-photo') // Exclude photo field
          .populate('category') // Populate category field with category details
          .sort([[sortBy, order]]) // Sort the products based on query parameters
          .limit(limit); // Limit the number of products

      // Return an empty array if no products are found
      res.json(products.length > 0 ? products : []);
  } catch (err) {
      return res.status(400).json({
          error: 'Products not found'
      });
  }
};


/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
      // Find related products
      const products = await Product.find({ _id: { $ne: req.product._id }, category: req.product.category })
          .limit(limit)
          .populate('category', '_id name');

      // Return related products as response
      res.json(products);
  } catch (err) {
      return res.status(400).json({
          error: 'Products not found'
      });
  }
};


exports.listCategories = async (req, res) => {
  try {
      // Get distinct categories from the Product collection
      const categories = await Product.distinct('category');

      // Return the categories as a JSON response
      res.json(categories);
  } catch (err) {
      return res.status(400).json({
          error: 'Categories not found'
      });
  }
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // Build findArgs from filters
  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === 'price') {
              findArgs[key] = {
                  $gte: req.body.filters[key][0],
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  try {
      const products = await Product.find(findArgs)
          .select('-photo')
          .populate('category')
          .sort([[sortBy, order]])
          .skip(skip)
          .limit(limit);

      res.json({
          size: products.length,
          data: products
      });
  } catch (err) {
      return res.status(400).json({
          error: 'Products not found'
      });
  }
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

// exports.listSearch = (req, res) => {
//     // create query object to hold search value and category value
//     const query = {};
//     // assign search value to query.name
//     if (req.query.search) {
//         query.name = { $regex: req.query.search, $options: 'i' };
//         // assigne category value to query.category
//         if (req.query.category && req.query.category != 'All') {
//             query.category = req.query.category;
//         }
//         // find the product based on query object with 2 properties
//         // search and category
//         Product.find(query, (err, products) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.json(products);
//         }).select('-photo');
//     }
// };

// exports.decreaseQuantity = (req, res, next) => {
//     let bulkOps = req.body.order.products.map(item => {
//         return {
//             updateOne: {
//                 filter: { _id: item._id },
//                 update: { $inc: { quantity: -item.count, sold: +item.count } }
//             }
//         };
//     });

//     Product.bulkWrite(bulkOps, {}, (error, products) => {
//         if (error) {
//             return res.status(400).json({
//                 error: 'Could not update product'
//             });
//         }
//         next();
//     });
// };
