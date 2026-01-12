const MenuItem = require('../models/MenuItem');

// Helper for error response
const sendError = (res, statusCode, message, code = 'ERROR') => {
    res.status(statusCode).json({
        success: false,
        error: { code, message }
    });
};

exports.createMenuItem = async (req, res) => {
    try {
        const { name, category, price, isAvailable, description } = req.body;

        if (!name || !price) {
            return sendError(res, 400, 'Name and price are required', 'VALIDATION_ERROR');
        }

        const menuItem = await MenuItem.create({
            name,
            category: category || 'other',
            price,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            description
        });

        res.status(201).json({
            success: true,
            data: menuItem,
            message: 'Menu item created successfully'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: menuItems,
            message: 'OK'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return sendError(res, 404, 'Menu item not found', 'NOT_FOUND');
        }
        res.json({
            success: true,
            data: menuItem,
            message: 'OK'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return sendError(res, 404, 'Menu item not found', 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: menuItem,
            message: 'Menu item updated'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return sendError(res, 404, 'Menu item not found', 'NOT_FOUND');
        }

        res.json({
            success: true,
            data: null,
            message: 'Menu item deleted'
        });
    } catch (error) {
        sendError(res, 500, error.message, 'SERVER_ERROR');
    }
};
