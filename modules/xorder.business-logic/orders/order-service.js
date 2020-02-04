const {
    Client
} = require('pg');
const AppConfig = require('../../xorder.common/config');
const Order = require('../../xorder.models/order');
const PizzaType = require('../../xorder.models/pizza-type');
const OrderStatus = require('../../xorder.models/enums/order-status');
const PizzaSize = require('../../xorder.models/enums/pizza-size');

class OrderService {

    constructor() {

        this.connection = new Client({
            ...AppConfig.DBConnection
        });

        this.connection.connect();

    }

    async getOrderById(orderId) {

        const order = await new Promise((resolve, reject) => {
            const orderQuery = `SELECT * FROM "Orders" o where id = $1`;
            this.connection.query(orderQuery, [orderId], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.rows[0]);
            });
        });

        order.orderPizzas = await this.getOrderPizzas(orderId);

        return Promise.resolve(order);

    }

    getOrderPizzas(orderId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT op.* , pt.type  FROM "OrderPizza" AS op
                           Inner join "PizzaType" AS pt on op."pizzaTypeId" = pt.id
                           where op."orderId" = $1`;
            this.connection.query(query, [orderId], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.rows);
            });
        });
    }

    getOrderPizza(orderPizzaId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT op.* , pt.type  FROM OrderPizza op
                           Inner join "PizzaType" AS  pt on op."pizzaTypeId" = pt.id
                           where op.id = $1`;
            this.connection.query(query, [orderPizzaId], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.rows[0]);
            });
        });
    }

    async getOrders(filter) {

        return new Promise((resolve, reject) => {

            filter = filter || {};
            const orderId = filter.orderId || null,
                status = filter.status || null,
                customerName = filter.customerName || null,
                customerAddress = filter.customerAddress || null;

            const orderQuery = `SELECT * FROM "Orders" where ("id" = $1 or $1 IS NULL) AND ("status" = $2 or $2 IS NULL)
                                AND ("customerName" = $3 or $3 IS NULL)
                                AND ("customerAddress" = $4 or $4 IS NULL)`;

            this.connection.query(orderQuery, [orderId, status, customerName, customerAddress], (err, result) => {
                if (err)
                    reject(err);
                else {
                    const orders = result.rows;
                    orders.forEach(async order => {
                        order.orderPizzas = await this.getOrderPizzas(order.id);
                    });
                    resolve(orders);
                }
            });
        });
    }

    async updateOrder(orderId, orderUpdate) {

        if (!orderId)
            return Promise.reject(Error('order id should be provided .'));

        if (!orderUpdate)
            return Promise.resolve();

        if (!orderUpdate.status || !(orderUpdate.status in OrderStatus))
            return Promise.reject(Error('invalid order status .'));

        if (!orderUpdate.customerName || !orderUpdate.customerName.trim())
            return Promise.reject(Error('order customer name should be provided .'));

        if (!orderUpdate.customerAddress || !orderUpdate.customerAddress.trim())
            return Promise.reject(Error('order customer address should be provided .'));


        const order = this.getOrderById(orderId);
        if (!order)
            return Promise.reject(new Error(`order ${orderId} not found .`));

        if (order.status === OrderStatus.delivered)
            return Promise.reject(new Error(`invalid operation : order ${orderId} is delivered so you can't update it .`));


        if (!orderUpdate.orderPizzas && !orderUpdate.orderPizzas instanceof Array)
            return Promise.reject(new Error(`invalid operation : order ${orderId} should has valid items .`));

        if (orderUpdate.orderPizzas && orderUpdate.orderPizzas instanceof Array)
            orderUpdate.orderPizzas = orderUpdate.orderPizzas || [];

        await new Promise((resolve, reject) => {
            const updateOrderQuery = `UPDATE Order set status = $1 , customerName = $2 , customerAddress= $3 where id = $4`;
            this.connection.query(createOrderPizzaSql, [orderUpdate.status, orderUpdate.customerName, orderUpdate.customerAddress, orderId], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });

        orderUpdate.orderPizzas.forEach(async op => {
            await this.updateOrderPizza(op);
        });

        return Promise.resolve();
    }

    async updateOrderPizza(orderPizzaUpdate) {

        if (!orderPizzaUpdate)
            return Promise.resolve();

        await this.validateOrderPizza(orderPizzaUpdate);

        const orderPizza = await this.getOrderPizza(orderPizzaUpdate.id);
        if (!orderPizza)
            return Promise.reject(new Error(`order pizza ${orderPizza.id} not found to update . `));

        const updateOrderPizzaQuery = `UPDATE OrderPizza set type = $1 , count = $2 , size = $3 where id = $4`;
        return new Promise((resolve, reject) => {
            this.connection.query(updateOrderPizzaQuery, [orderPizzaUpdate.type, orderPizzaUpdate.count, orderPizzaUpdate.size, orderPizza.id], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        })
    }

    createNewOrder(customerName, customerAddress, orderPizzas) {

        if (!customerName || !customerName.trim())
            return Promise.reject(new Error('customer name should be provided .'));

        if (!customerAddress || !customerAddress.trim())
            return Promise.reject(new Error('customer address should be provided .'));

        if (!(orderPizzas instanceof Array))
            return Promise.reject(new Error('invalid order pizzas info .'));

        if (!orderPizzas || orderPizzas.length == 0)
            return Promise.reject(new Error('order should have at least one pizza .'));

        return new Promise(async (resolve, reject) => {

            const createOrderSql = `insert into "Orders" ("customerName","customerAddress",status) values($1,$2,$3) RETURNING *`;
            this.connection.query(createOrderSql, [customerName, customerAddress, OrderStatus.new], async (err, result) => {
                if (err)
                    reject(err);
                else {
                    const createdOrder = result.rows[0];
                    createdOrder.orderPizzas = [];
                    createdOrder.orderPizzas.push(...orderPizzas);

                    createdOrder.orderPizzas.forEach(async op => {
                        const createdOrderPizza = await this.createOrderPizza(createdOrder, op);
                        op["id"] = createdOrderPizza.id;
                    });

                    resolve(createdOrder);
                }
            });
        });
    }

    async createOrderPizza(order, orderPizzaInfo) {

        if (!order)
            return Promise.reject(new Error(`order should be provided .`));

        await this.validateOrderPizza(orderPizzaInfo);

        const pizzaType = await this.getPizzaType(orderPizzaInfo.type);

        const createOrderPizzaSql = `insert into "OrderPizza"(size,count,"orderId","pizzaTypeId") values($1,$2,$3,$4) RETURNING *`;

        return new Promise((resolve, reject) => {

            this.connection.query(createOrderPizzaSql, [orderPizzaInfo.size, orderPizzaInfo.count, order.id, pizzaType.id], (err, result) => {
                if (err)
                    reject(err);
                else {
                    orderPizzaInfo.id = result.rows[0].id;
                    resolve(orderPizzaInfo);
                }
            });
        });


    }

    async validateOrderPizza(orderPizzaInfo) {

        if (!orderPizzaInfo)
            return Promise.reject(new Error(`order pizza info should be provided .`));

        if (!orderPizzaInfo.type || !orderPizzaInfo.type.trim())
            return Promise.reject(new Error(`order pizza type should be provided .`));

        const pizzaType = await this.getPizzaType(orderPizzaInfo.type);
        if (!pizzaType)
            return Promise.reject(new Error(`invalid order pizza type ${orderPizzaInfo.type} .`));

        if (!(orderPizzaInfo.size.toLowerCase() in PizzaSize))
            return Promise.reject(new Error(`invalid order pizza size ${orderPizzaInfo.size} .`));

        if (!orderPizzaInfo.count || orderPizzaInfo.count < 0 || Object.is(parseInt(orderPizzaInfo.count), NaN))
            return Promise.reject(new Error(`invalid order pizza count ${orderPizzaInfo.count} .`));

        return Promise.resolve();
    }

    getPizzaType(type) {

        if (!type || !type.trim())
            return Promise.reject(new Error('pizza type should be provided .'));

        return new Promise((resolve, reject) => {
            const query = `SELECT *  FROM "PizzaType" AS pt 
                           where type Like $1`;
            this.connection.query(query, [type], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.rows[0]);
            });
        });
    }

    deleteOrder(orderId) {

        return new Promise((resolve, reject) => {
            const deleteQuery = `delete from Order where id = $1`;
            this.connection.query(deleteQuery, [orderId], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    dispose() {
        // if (this.connection) {
        //     this.connection.end(err => {
        //         console.error('connection to database closed');
        //     });
        // }
    }
}

module.exports = OrderService;