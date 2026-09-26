import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import Wishlist from "../models/Wishlist.model.js";

const adminAddUser = async (req, res) => {
  try {
    const {username,email,password,phone} = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
      phone
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
        isVerified: newUser.isVerified,
        addresses: newUser.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to create user: ${error.message}`,
    });
  }
};

const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get users: ${error.message}`,
    });
  }
};

const adminGetUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get user: ${error.message}`,
    });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req?.user?._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Promise.all([
      Cart.deleteOne({ user: id }),
      Wishlist.deleteOne({ user: id }),
    ]);

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to delete user: ${error.message}`,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (req.params.id !== req?.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own account",
      });
    }

    const { username, phone, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username !== undefined && { username }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar })
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to update profile: ${error.message}`,
    });
  }
};

export {
  adminAddUser,
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser,
  updateProfile
};