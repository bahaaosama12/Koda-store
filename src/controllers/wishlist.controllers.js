import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      totalProducts: wishlist.products.length,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get wishlist: ${error.message}`,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });

      await wishlist.populate("products");

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist successfully",
        wishlist,
      });
    }

    const alreadyExists = wishlist.products.some(
      (wishlistProduct) => wishlistProduct._id.toString() === productId,
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const productExists = wishlist.products.some(
      (wishlistProduct) => wishlistProduct._id.toString() === productId,
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    wishlist.products = wishlist.products.filter(
      (wishlistProduct) => wishlistProduct._id.toString() !== productId,
    );

    await wishlist.save();
    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
