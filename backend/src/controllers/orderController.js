const Order = require('../models/Order');

const sendError = (res, statusCode, message, code = 'ERROR') => {
    res.status(statusCode).json({
        success: false,
        error: { code, message }
    });
};

exports.createOrder = async (req, res) => {
    try {
        const { customerName, items, note } = req.body;

        if (!customerName || !items || items.length === 0) {
            return sendError(res, 400, 'Customer name and items are required', 'VALIDATION_ERROR');
        }

        // Calculate total on server side for safety, using data provided in items
        // In a real app we might fetch prices from DB, but here we trust the item snapshot or calculate from payload
        const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const order = await Order.create({
            customerName,
            items,
            total,
            note,
            status: 'pending' // default
        });

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.getOrders = async (req, res) => {
    try {
        // Return sorted by newest first
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: orders,
            message: 'OK'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return sendError(res, 404, 'Order not found', 'NOT_FOUND');
        }
        res.json({
            success: true,
            data: order,
            message: 'OK'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.updateOrder = async (req, res) => {
    try {
        // Only allowing status update or full update? 
        // Usually orders are immutable except status.
        // But user asked for generic PUT. 
        // I will allow updating status and note primarily, but just generic update is fine for demo requirements.

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!order) {
            return sendError(res, 404, 'Order not found', 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: order,
            message: 'Order updated'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return sendError(res, 404, 'Order not found', 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: null,
            message: 'Order deleted'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};
