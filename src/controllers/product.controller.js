import productModel from "../models/product.model.js";
import storeModel from "../models/store.model.js";
import cloudniary from "../config/cloudniary.js";

// create product

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, storeId } = req.body;
    let imageData = {};
    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudniary.uploader.upload(file, {
        folder: "Products",
      });
      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const store = await storeModel.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // only vendor can create product

    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only add product to your own store",
      });
    }
    if (!store.isApproved) {
      return res.status(403).json({
        success: false,
        message: "store is not approved",
      });
    }

    const newProduct = new productModel({
      name,
      price,
      description,
      stock,
      store: storeId,
      owner: req.user._id,
      image: imageData,
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product added successfully ✅",
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT FROM STORE

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // only vendor can delete product

    if (
      productModel.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You and admin  can only delete product from your own store",
      });
    }
    const deleteProduct = await productModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "product deleted successfully ✅",
    });
  } catch (error) {
    next(error);
  }
};

// update product
export const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findProduct = await productModel.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this id",
      });
    }

    // only vendor can update product
    if (findProduct.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update product from your own store",
      });
    }

    const { name, price, description, stock, storeId } = req.body;

    const store = await storeModel.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        stock,
        storeId,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully ✅",
      updateProduct,
    });
  } catch (error) {
    next(error);
  }
};

// product listing

export const getProducts = async (req, res, next) => {
  try {
    let query = {};

    // search a product
    if (req.query.keyword) {
      query.name = {
         $regex: req.query.keyword, 
         $options: "i" 
      };
    }

    // filter products
    if (req.query.price) {
      query.price = {};
      if (req.query.price.gte) {
        query.price.$gte = Number(req.query.price.gte);
      }
      if (req.query.price.lte) {
        query.price.$lte =Number( req.query.price.lte);
      }
    }

    // sort products

    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort;
      sort[sortBy.replace("-", "")] = sortBy.startsWith("-") ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalProducts = await productModel.countDocuments(query);
    const products = await productModel
      .find()
      .populate("store", "storeName")
      .populate("owner", "username email");
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products fetched successfully ✅",
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      products,
      count: products.length,
    });
  } catch (error) {
    next(error);
  }
};

// product listing by id

export const getSingleProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel
      .findById(id)
      .populate("store", "storeName")
      .populate("owner", "username email");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with this ${id}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Product found with this ${id} id`,
      conunt: product.length,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// get all products by store id

export const getSingleProductByStoreId = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const products = await productModel.find({ store: storeId });
    if (!products) {
      return res.status(400).json({
        success: false,
        message: `Products not found with this  ${storeId} storeId`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Products fetched successfully ✅`,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// getProducts by Name

export const searchProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    const product = await productModel.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: `Products fetched successfully ✅`,
      count: product.length,
      product,
    });
  } catch (error) {
    next(error);
  }
};
