const OrderStatus = require('../../../xorder.models/enums/order-status');

function OrderDto() {
    this.pizzaType = null;
    this.pizaCount = null;
    this.size = null;
    this.customer = null;
    this.status = OrderStatus.new;
}