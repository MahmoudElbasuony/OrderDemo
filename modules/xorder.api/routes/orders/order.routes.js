const OrderController = require('../../controller/order-controller');

const orderRouts = [{
        method: 'GET',
        path: '/orders',
        handler: 'getOrders',
        controller: OrderController
    },
    {
        method: 'GET',
        path: '/orders/:id',
        handler: 'getOrderById',
        controller: OrderController
    },
    {
        method: 'POST',
        path: '/orders',
        handler: 'createOrder',
        controller: OrderController
    },
    {
        method: 'DELETE',
        path: 'orders/:id',
        handler: 'deleteOrder',
        controller: OrderController
    },
    {
        method: 'PUT',
        path: 'orders/:id',
        handler: 'updateOrder',
        controller : OrderController
    }
];




module.exports = orderRouts;