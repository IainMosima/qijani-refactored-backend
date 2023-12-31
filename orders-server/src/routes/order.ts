import express from "express";
import * as OrderController from "../controllers/order";

const router = express.Router();

// fetching all orders
router.get('/', OrderController.getOrders);

// creating an order
router.post('/:packageId', OrderController.createOrder);

// deleting an order
router.delete('/:orderId', OrderController.cancelOrder);

export default router;