const config = require('../xorder.common/config');
const { Host, Port } = config.Server;
const registerRoutes = require('./routes/router');
const orderRoutes = require('./routes/orders/order.routes');
const express = require('express');
const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

registerRoutes(app, orderRoutes);


app.listen(Port, Host, _ => { console.info(`server listening on port http://${Host}:${Port}`); });