import knex from 'knex'
import path from 'path'

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    pool: {
        min: 1,
        max: 20,
    },
    useNullAsDefault: true
})

export default connection