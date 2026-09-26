import { AVAILABLE_COUPONS } from "../utils/coupon.utils.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const getOrCreateCartFun = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      coupon: null,
    });
    await cart.save();
  }
  return cart;
};

const buildCartResponse = (cart) => ({
  success: true,
  itemCount: cart.itemCount,
  subtotal: cart.subtotal,
  discountAmount: cart.discountAmount,
  total: cart.total,
  coupon: cart.coupon?.code || null,
  items: cart.items.map((item) => ({
    _id: item._id,
    product: item.product,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  })),
});

const getOrCreateCart = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const cart = await getOrCreateCartFun(userId);
    return res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for get cart : ${error.message}`,
    });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const userId = req?.user?._id;
    let { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "product id is required",
      });
    }
    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    const cart = await getOrCreateCartFun(userId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `product not found`,
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `insufficient stock to product ${product.name}`,
      });
    }

    const existItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    let newQuantity = quantity;
    if (existItem) {
      newQuantity = existItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `insufficient stock to product ${product.name}`,
        });
      }
      cart.items = cart.items.map((item) =>
        item.product.toString() === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: product.price,
        quantity: quantity,
      });
    }
    await cart.save();
    res.status(200).json({
      ...buildCartResponse(cart),
      message: "item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for add item to cart : ${error.message}`,
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "product id is required",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `insufficient stock to product ${product.name}`,
      });
    }

    cart.items = cart.items.find((i) => {
      if (i.product.toString() === productId) {
        i.quantity = quantity;
      }
      return i;
    });
    await cart.save();

    return res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for update cart item quantity : ${error.message}`,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "product id is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "item not found in cart" });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    return res.status(200).json(buildCartResponse(cart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for remove item of cart : ${error.message}`,
    });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "coupon code is required" });
    }
    const upperCode = code.toUpperCase();
    const couponData = AVAILABLE_COUPONS[upperCode];
    if (!couponData) {
      return res
        .status(400)
        .json({ success: false, message: "invalid coupon code" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "can't apply coupon to an empty cart",
      });
    }

    cart.coupon = {
      code: couponData.code,
      discountType: couponData.type,
      discountValue: couponData.value,
    };

    await cart.save();

    const message =
      couponData.type === "percentage"
        ? `coupon applied - you save ${couponData.value}%`
        : `coupon applied - you save ${couponData.value} EGP`;

    return res.status(200).json({
      success: true,
      message,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
      coupon: cart.coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for apply coupon : ${error.message}`,
    });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const userId = req?.user?._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    cart.coupon = null;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "coupon removed",
      subtotal: cart.subtotal,
      total: cart.total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for remove coupon : ${error.message}`,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req?.user?._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    cart.items = [];
    cart.coupon = null;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "cart cleared",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in server for clear cart : ${error.message}`,
    });
  }
};

export {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
};
