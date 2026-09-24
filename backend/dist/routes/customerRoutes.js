"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
router.get('/customers', customerController_1.listCustomers);
router.get('/customers/:id', customerController_1.getCustomer);
router.post('/customers', customerController_1.createCustomer);
router.put('/customers/:id', customerController_1.updateCustomer);
router.delete('/customers/:id', customerController_1.removeCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map