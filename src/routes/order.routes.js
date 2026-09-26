import express from 'express'
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/order.controllers.js'
import { authentication  } from "../middleware/auth.middleware.js";
import {createOrderValidation} from "../validation/order.validation.js"
import { validate } from "../middleware/validationMiddleware.js";

const orderRouter = express.Router()

orderRouter.use(authentication)

orderRouter.post('/',validate(createOrderValidation), createOrder)

orderRouter.get('/my', getMyOrders)

orderRouter.get('/my/:id', getOrderById)

orderRouter.patch('/my/:id/cancel', cancelOrder)


export default orderRouter