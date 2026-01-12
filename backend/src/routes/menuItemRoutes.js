const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuItemController');

router.post('/', controller.createMenuItem);
router.get('/', controller.getMenuItems);
router.get('/:id', controller.getMenuItemById);
router.put('/:id', controller.updateMenuItem);
router.delete('/:id', controller.deleteMenuItem);

module.exports = router;
