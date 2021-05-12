const sql = require("mssql");
require('dotenv').config();

const poolConection = new sql.ConnectionPool(`mssql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_IP_CONNECT}/${process.env.DB_NAME_CONNECT}`)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL dbWoven')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

    module.exports = {poolConection}