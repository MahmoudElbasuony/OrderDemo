function Order() {
    this.id = null;
    this.orderPizzas = [];
    this.customerName = null;
    this.customerAddress = null;
    this.status = OrderStatus.new;
}

module.exports = Order;