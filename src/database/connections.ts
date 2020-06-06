import knex from 'knex'
// import path from 'path'

const connection = knex({
    // client: 'sqlite3',
    // connection: {
    //     filename: path.resolve(__dirname, 'database.sqlite')
    // },
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: {
        min: 1,
        max: 20,
    },
    useNullAsDefault: true,
});

export default connection