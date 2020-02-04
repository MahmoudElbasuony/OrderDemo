const ErrorReponse = require('../models/common/errorMsgDto');
const OrderService = require('../../xorder.business-logic/orders/order-service');

class OrderController {

    constructor() {
        this.ordersService = new OrderService();
    }

    async getOrderById(request, response) {

        const orderId = parseInt(request.params.id);

        try {

            const order = await this.ordersService.getOrderById(orderId);
            if (order)
                response.status(200).json(order);
            else
                response.status(400).send(`Order ${orderId} not found`);

        } catch (error) {
            response.status(500).json(new ErrorReponse(error));
        }
    }

    async getOrders(request, response) {

        try {
            const orders = await this.ordersService.getOrders({});
            response.status(200).json(orders);
        } catch (error) {
            response.status(500).json(new ErrorReponse(error));
        }

    }

    async deleteOrder(request, response) {

        const orderId = parseInt(request.params.id);
        try {
            await this.ordersService.deleteOrder(orderId);
        } catch (error) {
            response.status(500).json(new ErrorReponse(error));
        }

    }

    async updateOrder(request, response) {

        const orderId = parseInt(request.params.id);
        const orderUpdate = request.body;
        try {
            const updatedOrder = await this.ordersService.updateOrder(orderId, orderUpdate);
            response.status(200).json(order);
        } catch (error) {
            response.status(500).json(new ErrorReponse(error));
        }

    }

    async createOrder(request, response) {

        const {
            customerName,
            customerAddress,
            orderPizzas
        } = request.body;



        try {
            const newOrder = await this.ordersService.createNewOrder(customerName, customerAddress, orderPizzas);
            response.status(200).json(newOrder);
        } catch (error) {
            response.status(500).json(new ErrorReponse(error));
        }

    }

     dispose() {
        if (this.ordersService.dispose)
             this.ordersService.dispose();
    }
}



module.exports = OrderController;