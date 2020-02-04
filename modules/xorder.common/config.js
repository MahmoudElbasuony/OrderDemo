const AppConfig = {
    Server: {
        Port: 3000,
        Host: 'localhost'
    },
    DBConnection : {
        user : 'postgres',
        host : 'localhost',
        database :'OrderDb',
        password: '123456',
        port : 5432
    }
}


module.exports = AppConfig;