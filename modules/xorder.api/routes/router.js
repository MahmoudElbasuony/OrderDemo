function registerRoutes(app, routes) {

    if (routes && routes instanceof Array) {
        routes.forEach(route => {
            switch (route.method) {
                case 'GET':
                case 'POST':
                case 'DELETE':
                case 'PUT':
                    handleRequest(route, app);
                    break;
                default:
                    break;
            }
        });
    }

}

function handleRequest(route, app) {

    if (!route || !app)
        return;

    app[route.method.toLowerCase()](route.path, async (req, res, next) => {
        try {
            const controller = new route.controller();
            await controller[route.handler](req, res);
            controller.dispose();
        } catch (ex) {
            res.status(500).send('Internal server error');
        }
    });


}


module.exports = registerRoutes;