import mongoose from 'mongoose'
import Order from '../models/Order.model.js'
import Cart from '../models/Cart.model.js'
import Product from '../models/Product.model.js'
import { sendEmail, formatDate } from "../utils/email.js";
import User from '../models/User.model.js'

const createOrder = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { shippingAddress, paymentMethod, customerNote } = req.body
    const userId = req.user?._id

    const cart = await Cart.findOne({ user: userId }).session(session)
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: 'Cart is empty' })
    }

    let subtotal = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session)

      if (!product || !product.isActive) {
        await session.abortTransaction()
        session.endSession()
        return res.status(404).json({ message: `Product ${item.name} not found or inactive` })
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
        })
      }

      // Re-read the product's current purchase data at checkout instead of
      // trusting a potentially stale price/name/image stored in the cart.
      const currentPrice = product.price
      const currentImage = product.images?.[0]?.url || item.image

      product.stock -= item.quantity
      await product.save({ session })

      subtotal += currentPrice * item.quantity
      orderItems.push({
        product: product._id,
        name: product.name,
        image: currentImage,
        price: currentPrice,
        quantity: item.quantity
      })
    }

    const shippingFee = subtotal >= 1000 ? 0 : 50
    const tax = Math.round(subtotal * 0.14 * 100) / 100
    const discount = cart.discountAmount || 0
    const totalPrice = subtotal + shippingFee + tax - discount

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      subtotal,
      shippingFee,
      tax,
      discount,
      totalPrice,
      customerNote
    })

    await order.save({ session })

    cart.items = []
    cart.coupon = undefined
    await cart.save({ session })

    await session.commitTransaction()
    session.endSession()

    // send email to user
    const userDetails = await User.findById(userId)

    const { success } = await sendEmail(
      userDetails.email,
      `Order Confirmation ${order.shippingAddress.fullName}`,
      "orderConfirm-template.hbs",
      {
        orderId: order._id,
        customerName: order.shippingAddress.fullName,
        status: order.status,
        orderDate: formatDate(Date.now()),
        items: order.items.map(item => item.toObject()),        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        tax: order.tax,
        discount: order.discount,
        totalPrice: order.totalPrice,
        shippingAddress: order.shippingAddress.toObject(),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        year: new Date().getFullYear(),
      },
    )

    if (success) {
      return res.status(200).json({
          success: true,
          message: "order confirmation email sent successfully",
          data: order
      });
    } else {
      console.log("failed to send order confirmation");
      return res.status(500).json({
          success: false,
          message: "failed to send order confirmation",
      });
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id 
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    const filter = { user: userId }
    if (req.query.status) {
      filter.status = req.query.status
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter)
    ])

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      data: orders
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?._id 

    const order = await Order.findOne({ _id: id, user: userId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    return res.status(200).json({ success: true, data: order })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { id } = req.params
    const userId = req.user?._id 

    const order = await Order.findOne({ _id: id, user: userId }).session(session)
    if (!order) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status: ${order.status}`
      })
    }

    if (order.paymentStatus === 'paid') {
      await session.abortTransaction()
      session.endSession()
      return res.status(409).json({
        success: false,
        message: 'Paid orders require a refund flow before cancellation.',
      })
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      )
    }

    order.status = 'cancelled'
    order.cancelledAt = new Date()
    await order.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      success: true,
      message: 'Order cancelled and stock restored successfully',
      data: order
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return res.status(500).json({ success: false, message: error.message })
  }
}

export { 
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
 }