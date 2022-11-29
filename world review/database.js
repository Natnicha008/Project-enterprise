const mysql = require("mysql2");
const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webpro"

})
module.exports = dbConnection;